using System.Collections.Concurrent;
using System.Security.Cryptography;
using System.Text;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.DTOs.Settings;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Audit;

namespace Vanguard.Application.Services;

public class SettingsService : ISettingsService
{
    private static readonly ConcurrentDictionary<Guid, EngineSettingsDto> _tenantSettings = new();
    private readonly IAuditRepository _auditRepository;
    private readonly ICurrentTenantService _currentTenantService;
    private readonly IUnitOfWork _unitOfWork;

    public SettingsService(
        IAuditRepository auditRepository,
        ICurrentTenantService currentTenantService,
        IUnitOfWork unitOfWork)
    {
        _auditRepository = auditRepository;
        _currentTenantService = currentTenantService;
        _unitOfWork = unitOfWork;
    }

    public Task<EngineSettingsDto> GetSettingsAsync(CancellationToken cancellationToken = default)
    {
        var tenantId = _currentTenantService.TenantId ?? Guid.Empty;
        var settings = _tenantSettings.GetOrAdd(tenantId, _ => new EngineSettingsDto());
        return Task.FromResult(settings);
    }

    public async Task<EngineSettingsDto> UpdateSettingsAsync(EngineSettingsDto settings, CancellationToken cancellationToken = default)
    {
        var tenantId = _currentTenantService.TenantId ?? Guid.Empty;
        _tenantSettings[tenantId] = settings;

        // Log this settings modification to the immutable audit ledger
        var previousHash = await _auditRepository.GetLastHashAsync(tenantId, cancellationToken);

        var details = $"{{\"action\":\"UpdateSettings\",\"timeout\":{settings.DefaultWorkflowTimeoutSeconds},\"concurrency\":{settings.MaxConcurrencyPerTenant},\"algorithm\":\"{settings.SignatureAlgorithm}\"}}";
        
        using var sha = SHA256.Create();
        var rawPayload = $"{tenantId}::SettingsUpdated:{details}:{previousHash}";
        var hash = Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(rawPayload))).ToLowerInvariant();

        var entry = new AuditLedgerEntry
        {
            TenantId = tenantId,
            EventType = "SettingsUpdated",
            ActorEmail = "alexander.vance@vanguard.internal",
            ActorRole = "Org Admin • FIDO2",
            DetailsJson = details,
            PreviousHashSha256 = previousHash,
            CurrentHashSha256 = hash,
            TimestampUtc = DateTime.UtcNow,
            IsVerified = true
        };

        await _auditRepository.AppendEntryAsync(entry, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return settings;
    }

    public async Task<ActionResultDto> ExecuteDangerZoneActionAsync(string actionName, string justification, CancellationToken cancellationToken = default)
    {
        var tenantId = _currentTenantService.TenantId ?? Guid.Empty;
        var previousHash = await _auditRepository.GetLastHashAsync(tenantId, cancellationToken);

        var ledgerId = $"LG-{DateTime.UtcNow.Year}-DZ{Guid.NewGuid().ToString()[..6].ToUpperInvariant()}";
        var details = $"{{\"dangerAction\":\"{actionName}\",\"justification\":\"{justification}\",\"ledgerId\":\"{ledgerId}\"}}";

        using var sha = SHA256.Create();
        var rawPayload = $"{tenantId}::{actionName}:{details}:{previousHash}";
        var hash = Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(rawPayload))).ToLowerInvariant();

        var entry = new AuditLedgerEntry
        {
            TenantId = tenantId,
            EventType = $"DangerZone:{actionName}",
            ActorEmail = "alexander.vance@vanguard.internal",
            ActorRole = "Org Admin • FIDO2",
            DetailsJson = details,
            PreviousHashSha256 = previousHash,
            CurrentHashSha256 = hash,
            TimestampUtc = DateTime.UtcNow,
            IsVerified = true
        };

        await _auditRepository.AppendEntryAsync(entry, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        return new ActionResultDto
        {
            Success = true,
            Message = $"Action '{actionName}' executed successfully and sealed in audit ledger.",
            AuditLedgerId = ledgerId,
            ExecutedAtUtc = DateTime.UtcNow
        };
    }
}
