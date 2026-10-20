using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vanguard.Application.Common.Models;
using Vanguard.Application.DTOs.Executions;
using Vanguard.Application.Interfaces;
using Vanguard.Domain.Entities.Engine;

namespace Vanguard.Api.Controllers;

[ApiController]
[Route("api/executions")]
[Authorize]
[Produces("application/json")]
public class ExecutionController : ControllerBase
{
    private readonly IWorkflowEngine _workflowEngine;
    private readonly IValidator<StartExecutionRequestDto> _startValidator;

    public ExecutionController(
        IWorkflowEngine workflowEngine,
        IValidator<StartExecutionRequestDto> startValidator)
    {
        _workflowEngine = workflowEngine;
        _startValidator = startValidator;
    }

    [HttpPost("start")]
    [ProducesResponseType(typeof(ApiResponse<ExecutionInstanceSummaryDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ExecutionInstanceSummaryDto>>> StartWorkflow(
        [FromBody] StartExecutionRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _startValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Données de déclenchement invalides.", errors));
        }

        try
        {
            var userId = GetCurrentUserId();
            var result = await _workflowEngine.StartWorkflowAsync(request, userId, cancellationToken);
            return StatusCode(StatusCodes.Status201Created, ApiResponse.Success(result, $"Instance {result.ReferenceNumber} démarrée avec succès."));
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

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ExecutionInstanceSummaryDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ExecutionInstanceSummaryDto>>>> GetExecutions(
        [FromQuery] ExecutionStatus? status,
        [FromQuery] Guid? workflowDefinitionId,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var list = await _workflowEngine.GetExecutionsAsync(status, workflowDefinitionId, search, cancellationToken);
        return Ok(ApiResponse.Success(list));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ExecutionInstanceDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ExecutionInstanceDetailDto>>> GetExecutionById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var result = await _workflowEngine.GetExecutionByIdAsync(id, cancellationToken);
        if (result == null)
        {
            return NotFound(ApiResponse.Failure<object>($"Instance d'exécution '{id}' introuvable."));
        }

        return Ok(ApiResponse.Success(result));
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("sub")?.Value;

        return Guid.TryParse(claim, out var userId) ? userId : null;
    }
}
