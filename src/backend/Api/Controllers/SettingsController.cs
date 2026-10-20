using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vanguard.Application.Common.Models;
using Vanguard.Application.DTOs.Settings;
using Vanguard.Application.Interfaces;

namespace Vanguard.Api.Controllers;

[ApiController]
[Route("api/settings")]
[Authorize(Roles = "SuperAdmin,OrgAdmin")]
[Produces("application/json")]
public class SettingsController : ControllerBase
{
    private readonly ISettingsService _settingsService;

    public SettingsController(ISettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<EngineSettingsDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<EngineSettingsDto>>> GetSettings(CancellationToken cancellationToken)
    {
        var settings = await _settingsService.GetSettingsAsync(cancellationToken);
        return Ok(ApiResponse.Success(settings));
    }

    [HttpPut]
    [ProducesResponseType(typeof(ApiResponse<EngineSettingsDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<EngineSettingsDto>>> UpdateSettings(
        [FromBody] EngineSettingsDto settings,
        CancellationToken cancellationToken)
    {
        var updated = await _settingsService.UpdateSettingsAsync(settings, cancellationToken);
        return Ok(ApiResponse.Success(updated));
    }

    [HttpPost("actions/{actionName}")]
    [ProducesResponseType(typeof(ApiResponse<ActionResultDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<ActionResultDto>>> ExecuteDangerZoneAction(
        string actionName,
        [FromBody] DangerZoneActionRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _settingsService.ExecuteDangerZoneActionAsync(actionName, request.Justification, cancellationToken);
        return Ok(ApiResponse.Success(result));
    }
}
