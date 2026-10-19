using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vanguard.Application.Common.Models;
using Vanguard.Application.DTOs.Requests;
using Vanguard.Application.Interfaces;

namespace Vanguard.Api.Controllers;

[ApiController]
[Route("api/requests")]
[Authorize]
[Produces("application/json")]
public class RequestController : ControllerBase
{
    private readonly IRequestHubService _requestHubService;
    private readonly IValidator<SubmitCatalogRequestDto> _submitValidator;

    public RequestController(
        IRequestHubService requestHubService,
        IValidator<SubmitCatalogRequestDto> submitValidator)
    {
        _requestHubService = requestHubService;
        _submitValidator = submitValidator;
    }

    [HttpGet("templates")]
    [ProducesResponseType(typeof(ApiResponse<List<CatalogTemplateDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<CatalogTemplateDto>>>> GetTemplates(CancellationToken cancellationToken)
    {
        var templates = await _requestHubService.GetCatalogTemplatesAsync(cancellationToken);
        return Ok(ApiResponse.Success(templates));
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<ServiceRequestSummaryDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ServiceRequestSummaryDto>>>> GetRequests(
        [FromQuery] string? status,
        [FromQuery] string? department,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var list = await _requestHubService.GetRequestsAsync(status, department, search, cancellationToken);
        return Ok(ApiResponse.Success(list));
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ServiceRequestDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<ServiceRequestDetailDto>>> GetRequestById(Guid id, CancellationToken cancellationToken)
    {
        var result = await _requestHubService.GetRequestByIdAsync(id, cancellationToken);
        if (result == null)
        {
            return NotFound(ApiResponse.Failure<object>($"Requête '{id}' introuvable."));
        }

        return Ok(ApiResponse.Success(result));
    }

    [HttpPost("submit")]
    [ProducesResponseType(typeof(ApiResponse<ServiceRequestSummaryDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ApiResponse<ServiceRequestSummaryDto>>> SubmitRequest(
        [FromBody] SubmitCatalogRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _submitValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            var errors = validation.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());

            return BadRequest(ApiResponse.Failure<object>("Données de requête invalides.", errors));
        }

        var userId = GetCurrentUserId();
        var result = await _requestHubService.SubmitRequestAsync(request, userId, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse.Success(result, $"Requête {result.RequestNumber} soumise avec succès."));
    }

    [HttpPost("{id:guid}/expedite")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<bool>>> ExpediteSla(Guid id, CancellationToken cancellationToken)
    {
        var success = await _requestHubService.ExpediteSlaAsync(id, cancellationToken);
        if (!success)
        {
            return NotFound(ApiResponse.Failure<object>($"Requête '{id}' introuvable pour accélération."));
        }

        return Ok(ApiResponse.Success(true, "SLA accéléré avec succès."));
    }

    [HttpPost("{id:guid}/reject")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ApiResponse<bool>>> RejectRequest(
        Guid id,
        [FromBody] RejectRequestModel model,
        CancellationToken cancellationToken)
    {
        var success = await _requestHubService.RejectRequestAsync(id, model.Reason, cancellationToken);
        if (!success)
        {
            return NotFound(ApiResponse.Failure<object>($"Requête '{id}' introuvable."));
        }

        return Ok(ApiResponse.Success(true, "Requête rejetée."));
    }

    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                    ?? User.FindFirst("sub")?.Value;

        return Guid.TryParse(claim, out var userId) ? userId : null;
    }
}

public record RejectRequestModel(string Reason);
