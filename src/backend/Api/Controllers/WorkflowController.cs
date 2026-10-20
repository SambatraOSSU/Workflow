using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vanguard.Application.Common.Models;
using Vanguard.Application.DTOs.Workflows;
using Vanguard.Application.Interfaces;

namespace Vanguard.Api.Controllers;

[ApiController]
[Route("api/workflows")]
[Authorize]
[Produces("application/json")]
public class WorkflowController : ControllerBase
{
    private readonly IWorkflowService _workflowService;
    private readonly IValidator<CreateWorkflowRequestDto> _createValidator;
    private readonly IValidator<UpdateWorkflowRequestDto> _updateValidator;
    private readonly IValidator<SaveWorkflowGraphRequestDto> _saveGraphValidator;
    private readonly IValidator<PublishWorkflowVersionRequestDto> _publishValidator;

    public WorkflowController(
        IWorkflowService workflowService,
        IValidator<CreateWorkflowRequestDto> createValidator,
        IValidator<UpdateWorkflowRequestDto> updateValidator,
        IValidator<SaveWorkflowGraphRequestDto> saveGraphValidator,
        IValidator<PublishWorkflowVersionRequestDto> publishValidator)
    {
        _workflowService = workflowService;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _saveGraphValidator = saveGraphValidator;
        _publishValidator = publishValidator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<WorkflowSummaryDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<WorkflowSummaryDto>>>> GetWorkflows(
        [FromQuery] string? category,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var workflows = await _workflowService.GetWorkflowsAsync(category, search, cancellationToken);
        return Ok(ApiResponse.Success(workflows, $"{workflows.Count} workflow(s) récupéré(s)."));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<WorkflowDetailDto>>> GetWorkflowById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var workflow = await _workflowService.GetWorkflowByIdAsync(id, cancellationToken);
        if (workflow == null)
        {
            return NotFound(ApiResponse.Failure<object>($"Workflow '{id}' introuvable."));
        }

        return Ok(ApiResponse.Success(workflow));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,OrgAdmin,WorkflowDesigner")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowSummaryDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<WorkflowSummaryDto>>> CreateWorkflow(
        [FromBody] CreateWorkflowRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _createValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Données de workflow invalides.", errors));
        }

        try
        {
            var userId = GetCurrentUserId();
            var created = await _workflowService.CreateWorkflowAsync(request, userId, cancellationToken);
            return StatusCode(StatusCodes.Status201Created, ApiResponse.Success(created, "Workflow créé avec succès."));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse.Failure<object>(ex.Message));
        }
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,OrgAdmin,WorkflowDesigner")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowSummaryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<WorkflowSummaryDto>>> UpdateWorkflow(
        Guid id,
        [FromBody] UpdateWorkflowRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _updateValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Données de mise à jour invalides.", errors));
        }

        try
        {
            var updated = await _workflowService.UpdateWorkflowAsync(id, request, cancellationToken);
            return Ok(ApiResponse.Success(updated, "Workflow mis à jour avec succès."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse.Failure<object>(ex.Message));
        }
    }

    [HttpPost("validate-graph")]
    [ProducesResponseType(typeof(ApiResponse<GraphValidationResultDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<GraphValidationResultDto>>> ValidateGraph(
        [FromBody] SaveWorkflowGraphRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _saveGraphValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Graphe JSON invalide.", errors));
        }

        var result = await _workflowService.ValidateGraphAsync(request, cancellationToken);
        return Ok(ApiResponse.Success(result, result.IsValid ? "Graphe valide." : "Erreurs de topologie détectées."));
    }

    [HttpPut("{id:guid}/graph")]
    [Authorize(Roles = "SuperAdmin,OrgAdmin,WorkflowDesigner")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<WorkflowDetailDto>>> SaveDraftGraph(
        Guid id,
        [FromBody] SaveWorkflowGraphRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _saveGraphValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Graphe JSON invalide.", errors));
        }

        try
        {
            var userId = GetCurrentUserId();
            var result = await _workflowService.SaveDraftGraphAsync(id, request, userId, cancellationToken);
            return Ok(ApiResponse.Success(result, "Graphe sauvegardé avec succès."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse.Failure<object>(ex.Message));
        }
    }

    [HttpPost("{id:guid}/publish")]
    [Authorize(Roles = "SuperAdmin,OrgAdmin,WorkflowDesigner")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowVersionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<WorkflowVersionDto>>> PublishVersion(
        Guid id,
        [FromBody] PublishWorkflowVersionRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _publishValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Données de publication invalides.", errors));
        }

        try
        {
            var userId = GetCurrentUserId();
            var published = await _workflowService.PublishVersionAsync(id, request, userId, cancellationToken);
            return Ok(ApiResponse.Success(published, $"Version v{published.VersionNumber} publiée avec succès et scellée dans le registre d'audit."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse.Failure<object>(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse.Failure<object>(ex.Message));
        }
    }

    [HttpGet("{id:guid}/versions")]
    [ProducesResponseType(typeof(ApiResponse<List<WorkflowVersionSummaryDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<WorkflowVersionSummaryDto>>>> GetVersions(
        Guid id,
        CancellationToken cancellationToken)
    {
        var versions = await _workflowService.GetWorkflowVersionsAsync(id, cancellationToken);
        return Ok(ApiResponse.Success(versions));
    }

    [HttpGet("{id:guid}/versions/{versionNumber:int}")]
    [ProducesResponseType(typeof(ApiResponse<WorkflowVersionDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<WorkflowVersionDto>>> GetVersionByNumber(
        Guid id,
        int versionNumber,
        CancellationToken cancellationToken)
    {
        var version = await _workflowService.GetWorkflowVersionAsync(id, versionNumber, cancellationToken);
        if (version == null)
        {
            return NotFound(ApiResponse.Failure<object>($"Version {versionNumber} introuvable pour ce workflow."));
        }

        return Ok(ApiResponse.Success(version));
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("sub")?.Value;

        return Guid.TryParse(claim, out var userId) ? userId : Guid.Empty;
    }
}
