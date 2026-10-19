using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vanguard.Application.Common.Models;
using Vanguard.Application.DTOs.Tasks;
using Vanguard.Application.Interfaces;
using TaskStatus = Vanguard.Domain.Entities.Tasks.TaskStatus;

namespace Vanguard.Api.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
[Produces("application/json")]
public class TaskController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly IValidator<ApproveTaskRequestDto> _approveValidator;
    private readonly IValidator<RejectTaskRequestDto> _rejectValidator;
    private readonly IValidator<DelegateTaskRequestDto> _delegateValidator;

    public TaskController(
        ITaskService taskService,
        IValidator<ApproveTaskRequestDto> approveValidator,
        IValidator<RejectTaskRequestDto> rejectValidator,
        IValidator<DelegateTaskRequestDto> delegateValidator)
    {
        _taskService = taskService;
        _approveValidator = approveValidator;
        _rejectValidator = rejectValidator;
        _delegateValidator = delegateValidator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<TaskSummaryDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<TaskSummaryDto>>>> GetTasks(
        [FromQuery] string? priority,
        [FromQuery] TaskStatus? status,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var userId = GetCurrentUserId();
        var tasks = await _taskService.GetTasksAsync(userId, priority, status, search, cancellationToken);
        return Ok(ApiResponse.Success(tasks, $"{tasks.Count} tâche(s) récupérée(s)."));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<TaskDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TaskDetailDto>>> GetTaskById(
        Guid id,
        CancellationToken cancellationToken)
    {
        var task = await _taskService.GetTaskByIdAsync(id, cancellationToken);
        if (task == null)
        {
            return NotFound(ApiResponse.Failure<object>($"Tâche '{id}' introuvable."));
        }

        return Ok(ApiResponse.Success(task));
    }

    [HttpPost("{id:guid}/approve")]
    [ProducesResponseType(typeof(ApiResponse<TaskDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TaskDetailDto>>> ApproveTask(
        Guid id,
        [FromBody] ApproveTaskRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _approveValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Données d'approbation invalides.", errors));
        }

        try
        {
            var userId = GetCurrentUserId();
            var result = await _taskService.ApproveTaskAsync(id, request, userId, cancellationToken);
            return Ok(ApiResponse.Success(result, "Tâche approuvée avec succès. Transition d'état exécutée."));
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

    [HttpPost("{id:guid}/reject")]
    [ProducesResponseType(typeof(ApiResponse<TaskDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TaskDetailDto>>> RejectTask(
        Guid id,
        [FromBody] RejectTaskRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _rejectValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Motif de rejet invalide.", errors));
        }

        try
        {
            var userId = GetCurrentUserId();
            var result = await _taskService.RejectTaskAsync(id, request, userId, cancellationToken);
            return Ok(ApiResponse.Success(result, "Tâche rejetée. Instance de workflow clôturée."));
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

    [HttpPost("{id:guid}/delegate")]
    [ProducesResponseType(typeof(ApiResponse<TaskDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<TaskDetailDto>>> DelegateTask(
        Guid id,
        [FromBody] DelegateTaskRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _delegateValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Données de délégation invalides.", errors));
        }

        try
        {
            var userId = GetCurrentUserId();
            var result = await _taskService.DelegateTaskAsync(id, request, userId, cancellationToken);
            return Ok(ApiResponse.Success(result, $"Tâche réassignée avec succès à {request.DelegateToUserEmail}."));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse.Failure<object>(ex.Message));
        }
    }

    private Guid GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("sub")?.Value;

        return Guid.TryParse(claim, out var userId) ? userId : Guid.Empty;
    }
}
