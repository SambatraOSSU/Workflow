using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.DTOs.Workflows;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Audit;
using Vanguard.Domain.Entities.Workflows;

namespace Vanguard.Application.Services;

public class WorkflowService : IWorkflowService
{
    private readonly IWorkflowRepository _workflowRepository;
    private readonly IAuditRepository _auditRepository;
    private readonly IGraphValidator _graphValidator;
    private readonly ICurrentTenantService _currentTenantService;
    private readonly IUnitOfWork _unitOfWork;

    private static readonly string DefaultGraphJson = JsonSerializer.Serialize(new WorkflowGraphDto(
        Nodes: new List<WorkflowNodeDto>
        {
            new("node-1", "trigger", "webhook", "Webhook Ingest", "REST/mTLS payload ingest", new NodePositionDto(32, 64), new NodeConfigDto(EventName: "po.created")),
            new("node-2", "end", "slack", "Slack Dispatch", "Post notification to channel", new NodePositionDto(480, 64), new NodeConfigDto(NotificationTarget: "#general"))
        },
        Edges: new List<WorkflowEdgeDto>
        {
            new("edge-1", "node-1", "node-2", "Proceed", null, "navy")
        }
    ));

    public WorkflowService(
        IWorkflowRepository workflowRepository,
        IAuditRepository auditRepository,
        IGraphValidator graphValidator,
        ICurrentTenantService currentTenantService,
        IUnitOfWork unitOfWork)
    {
        _workflowRepository = workflowRepository;
        _auditRepository = auditRepository;
        _graphValidator = graphValidator;
        _currentTenantService = currentTenantService;
        _unitOfWork = unitOfWork;
    }

    public async Task<List<WorkflowSummaryDto>> GetWorkflowsAsync(string? category = null, string? search = null, CancellationToken cancellationToken = default)
    {
        var workflows = await _workflowRepository.GetAllAsync(category, search, cancellationToken);
        var result = new List<WorkflowSummaryDto>();

        foreach (var wf in workflows)
        {
            var latestVersion = await _workflowRepository.GetLatestVersionAsync(wf.Id, cancellationToken);
            var nodeCount = 0;
            if (latestVersion != null && !string.IsNullOrWhiteSpace(latestVersion.GraphDefinitionJson))
            {
                try
                {
                    using var doc = JsonDocument.Parse(latestVersion.GraphDefinitionJson);
                    if (doc.RootElement.TryGetProperty("nodes", out var nodesProp) && nodesProp.ValueKind == JsonValueKind.Array)
                    {
                        nodeCount = nodesProp.GetArrayLength();
                    }
                }
                catch
                {
                    nodeCount = 0;
                }
            }

            result.Add(new WorkflowSummaryDto(
                wf.Id,
                wf.Key,
                wf.Title,
                wf.Description,
                wf.Department,
                wf.Category,
                wf.CurrentVersionNumber,
                wf.Status,
                wf.IsActive,
                nodeCount,
                wf.UpdatedAtUtc,
                wf.CreatedAtUtc
            ));
        }

        return result;
    }

    public async Task<WorkflowDetailDto?> GetWorkflowByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var wf = await _workflowRepository.GetByIdWithVersionsAsync(id, cancellationToken);
        if (wf == null) return null;

        var latestVersion = wf.Versions
            .OrderByDescending(v => v.VersionNumber)
            .FirstOrDefault();

        WorkflowVersionDto? activeVersionDto = null;
        if (latestVersion != null)
        {
            activeVersionDto = new WorkflowVersionDto(
                latestVersion.Id,
                latestVersion.WorkflowDefinitionId,
                latestVersion.VersionNumber,
                latestVersion.GraphDefinitionJson,
                latestVersion.HashSha256,
                latestVersion.IsActive,
                latestVersion.PublishedAtUtc,
                latestVersion.PublishedByUserId,
                "Platform System"
            );
        }

        var versionsList = wf.Versions
            .OrderByDescending(v => v.VersionNumber)
            .Select(v => new WorkflowVersionSummaryDto(
                v.Id,
                v.VersionNumber,
                v.HashSha256,
                v.IsActive,
                v.PublishedAtUtc,
                "Platform System"
            ))
            .ToList();

        return new WorkflowDetailDto(
            wf.Id,
            wf.Key,
            wf.Title,
            wf.Description,
            wf.Department,
            wf.Category,
            wf.CurrentVersionNumber,
            wf.Status,
            wf.IsActive,
            wf.UpdatedAtUtc,
            wf.CreatedAtUtc,
            activeVersionDto,
            versionsList
        );
    }

    public async Task<WorkflowSummaryDto> CreateWorkflowAsync(CreateWorkflowRequestDto dto, Guid userId, CancellationToken cancellationToken = default)
    {
        if (await _workflowRepository.ExistsKeyAsync(dto.Key, cancellationToken))
        {
            throw new InvalidOperationException($"Un workflow avec la clé '{dto.Key}' existe déjà pour ce tenant.");
        }

        var tenantId = _currentTenantService.TenantId ?? Guid.Empty;

        var workflow = new WorkflowDefinition
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            Key = dto.Key.Trim().ToLowerInvariant(),
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            Department = dto.Department.Trim(),
            Category = dto.Category.Trim(),
            CurrentVersionNumber = 1,
            Status = WorkflowStatus.Draft,
            IsActive = true
        };

        var initialGraphJson = DefaultGraphJson;
        var hash = ComputeSha256(initialGraphJson);

        var version = new WorkflowVersion
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            WorkflowDefinitionId = workflow.Id,
            VersionNumber = 1,
            GraphDefinitionJson = initialGraphJson,
            HashSha256 = hash,
            IsActive = true,
            PublishedAtUtc = DateTime.UtcNow,
            PublishedByUserId = userId
        };

        await _workflowRepository.AddAsync(workflow, cancellationToken);
        await _workflowRepository.AddVersionAsync(version, cancellationToken);

        var prevHash = await _auditRepository.GetLastHashAsync(tenantId, cancellationToken);
        var auditEntry = new AuditLedgerEntry
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            EventType = "Publication",
            ActorEmail = "designer@vanguard.io",
            ActorRole = "WorkflowDesigner",
            DetailsJson = JsonSerializer.Serialize(new { workflow.Key, workflow.Title, Version = 1 }),
            PreviousHashSha256 = prevHash,
            CurrentHashSha256 = ComputeSha256($"{prevHash}:{workflow.Id}:WorkflowCreated:{DateTime.UtcNow:O}"),
            TimestampUtc = DateTime.UtcNow,
            IsVerified = true
        };
        await _auditRepository.AppendEntryAsync(auditEntry, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);

        return new WorkflowSummaryDto(
            workflow.Id,
            workflow.Key,
            workflow.Title,
            workflow.Description,
            workflow.Department,
            workflow.Category,
            workflow.CurrentVersionNumber,
            workflow.Status,
            workflow.IsActive,
            2,
            workflow.UpdatedAtUtc,
            workflow.CreatedAtUtc
        );
    }

    public async Task<WorkflowSummaryDto> UpdateWorkflowAsync(Guid id, UpdateWorkflowRequestDto dto, CancellationToken cancellationToken = default)
    {
        var workflow = await _workflowRepository.GetByIdAsync(id, cancellationToken);
        if (workflow == null)
        {
            throw new KeyNotFoundException($"Workflow '{id}' introuvable.");
        }

        workflow.Title = dto.Title.Trim();
        workflow.Description = dto.Description.Trim();
        workflow.Department = dto.Department.Trim();
        workflow.Category = dto.Category.Trim();
        workflow.Status = dto.Status;
        workflow.UpdatedAtUtc = DateTime.UtcNow;

        _workflowRepository.Update(workflow);
        await _unitOfWork.CommitAsync(cancellationToken);

        return new WorkflowSummaryDto(
            workflow.Id,
            workflow.Key,
            workflow.Title,
            workflow.Description,
            workflow.Department,
            workflow.Category,
            workflow.CurrentVersionNumber,
            workflow.Status,
            workflow.IsActive,
            0,
            workflow.UpdatedAtUtc,
            workflow.CreatedAtUtc
        );
    }

    public Task<GraphValidationResultDto> ValidateGraphAsync(SaveWorkflowGraphRequestDto dto, CancellationToken cancellationToken = default)
    {
        var result = _graphValidator.ValidateGraph(dto.GraphDefinitionJson);
        return Task.FromResult(result);
    }

    public async Task<WorkflowDetailDto> SaveDraftGraphAsync(Guid id, SaveWorkflowGraphRequestDto dto, Guid userId, CancellationToken cancellationToken = default)
    {
        var workflow = await _workflowRepository.GetByIdWithVersionsAsync(id, cancellationToken);
        if (workflow == null)
        {
            throw new KeyNotFoundException($"Workflow '{id}' introuvable.");
        }

        var tenantId = _currentTenantService.TenantId ?? Guid.Empty;
        var hash = ComputeSha256(dto.GraphDefinitionJson);

        // Récupérer la dernière version ou en créer une nouvelle
        var latestVersion = workflow.Versions.OrderByDescending(v => v.VersionNumber).FirstOrDefault();

        if (latestVersion == null || workflow.Status == WorkflowStatus.Published)
        {
            // Si la version précédente était publiée, toute modification crée un nouveau brouillon
            var nextVersionNumber = workflow.CurrentVersionNumber + 1;
            var newDraftVersion = new WorkflowVersion
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                WorkflowDefinitionId = workflow.Id,
                VersionNumber = nextVersionNumber,
                GraphDefinitionJson = dto.GraphDefinitionJson,
                HashSha256 = hash,
                IsActive = true,
                PublishedAtUtc = DateTime.UtcNow,
                PublishedByUserId = userId
            };

            workflow.CurrentVersionNumber = nextVersionNumber;
            workflow.Status = WorkflowStatus.Draft;
            workflow.UpdatedAtUtc = DateTime.UtcNow;

            await _workflowRepository.AddVersionAsync(newDraftVersion, cancellationToken);
            _workflowRepository.Update(workflow);
        }
        else
        {
            // Mise à jour du brouillon existant en cours
            latestVersion.GraphDefinitionJson = dto.GraphDefinitionJson;
            latestVersion.HashSha256 = hash;
            latestVersion.PublishedAtUtc = DateTime.UtcNow;
            latestVersion.PublishedByUserId = userId;
            workflow.UpdatedAtUtc = DateTime.UtcNow;
            _workflowRepository.Update(workflow);
        }

        await _unitOfWork.CommitAsync(cancellationToken);

        return (await GetWorkflowByIdAsync(id, cancellationToken))!;
    }

    public async Task<WorkflowVersionDto> PublishVersionAsync(Guid id, PublishWorkflowVersionRequestDto dto, Guid userId, CancellationToken cancellationToken = default)
    {
        var workflow = await _workflowRepository.GetByIdWithVersionsAsync(id, cancellationToken);
        if (workflow == null)
        {
            throw new KeyNotFoundException($"Workflow '{id}' introuvable.");
        }

        var latestVersion = workflow.Versions.OrderByDescending(v => v.VersionNumber).FirstOrDefault();
        if (latestVersion == null)
        {
            throw new InvalidOperationException("Aucune version ou graphe existant à publier.");
        }

        // 1. Validation obligatoire de la topologie avant publication
        var validation = _graphValidator.ValidateGraph(latestVersion.GraphDefinitionJson);
        if (!validation.IsValid)
        {
            var joinedErrors = string.Join(" | ", validation.Errors);
            throw new InvalidOperationException($"La publication a échoué en raison d'erreurs de topologie: {joinedErrors}");
        }

        var tenantId = _currentTenantService.TenantId ?? Guid.Empty;
        var hash = ComputeSha256(latestVersion.GraphDefinitionJson);

        latestVersion.HashSha256 = hash;
        latestVersion.IsActive = true;
        latestVersion.PublishedAtUtc = DateTime.UtcNow;
        latestVersion.PublishedByUserId = userId;

        workflow.Status = WorkflowStatus.Published;
        workflow.UpdatedAtUtc = DateTime.UtcNow;
        _workflowRepository.Update(workflow);

        // 2. Registre d'Audit SOX-404 immuable avec scellement SHA-256
        var prevHash = await _auditRepository.GetLastHashAsync(tenantId, cancellationToken);
        var auditEntry = new AuditLedgerEntry
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            EventType = "Publication",
            ActorEmail = "designer@vanguard.io",
            ActorRole = "WorkflowDesigner",
            DetailsJson = JsonSerializer.Serialize(new
            {
                WorkflowKey = workflow.Key,
                Version = latestVersion.VersionNumber,
                Hash = hash,
                ChangeNotes = dto.ChangeNotes ?? "Published version release"
            }),
            PreviousHashSha256 = prevHash,
            CurrentHashSha256 = ComputeSha256($"{prevHash}:{latestVersion.Id}:{hash}:{DateTime.UtcNow:O}"),
            TimestampUtc = DateTime.UtcNow,
            IsVerified = true
        };
        await _auditRepository.AppendEntryAsync(auditEntry, cancellationToken);

        await _unitOfWork.CommitAsync(cancellationToken);

        return new WorkflowVersionDto(
            latestVersion.Id,
            latestVersion.WorkflowDefinitionId,
            latestVersion.VersionNumber,
            latestVersion.GraphDefinitionJson,
            latestVersion.HashSha256,
            latestVersion.IsActive,
            latestVersion.PublishedAtUtc,
            userId,
            "Platform System"
        );
    }

    public async Task<List<WorkflowVersionSummaryDto>> GetWorkflowVersionsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var versions = await _workflowRepository.GetVersionsAsync(id, cancellationToken);
        return versions.Select(v => new WorkflowVersionSummaryDto(
            v.Id,
            v.VersionNumber,
            v.HashSha256,
            v.IsActive,
            v.PublishedAtUtc,
            "Platform System"
        )).ToList();
    }

    public async Task<WorkflowVersionDto?> GetWorkflowVersionAsync(Guid id, int versionNumber, CancellationToken cancellationToken = default)
    {
        var v = await _workflowRepository.GetVersionByNumberAsync(id, versionNumber, cancellationToken);
        if (v == null) return null;

        return new WorkflowVersionDto(
            v.Id,
            v.WorkflowDefinitionId,
            v.VersionNumber,
            v.GraphDefinitionJson,
            v.HashSha256,
            v.IsActive,
            v.PublishedAtUtc,
            v.PublishedByUserId,
            "Platform System"
        );
    }

    private static string ComputeSha256(string raw)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(raw));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
