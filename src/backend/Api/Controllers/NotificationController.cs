using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vanguard.Application.Common.Models;
using Vanguard.Application.DTOs.Notification;
using Vanguard.Application.Interfaces;

namespace Vanguard.Api.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
[Produces("application/json")]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<NotificationDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<NotificationDto>>>> GetNotifications(
        [FromQuery] string? category,
        [FromQuery] string? severity,
        [FromQuery] bool? unreadOnly,
        [FromQuery] string? search,
        CancellationToken cancellationToken)
    {
        var notifications = await _notificationService.GetNotificationsAsync(category, severity, unreadOnly, search, cancellationToken);
        return Ok(ApiResponse.Success(notifications));
    }

    [HttpGet("summary")]
    [ProducesResponseType(typeof(ApiResponse<NotificationSummaryDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<NotificationSummaryDto>>> GetSummary(CancellationToken cancellationToken)
    {
        var summary = await _notificationService.GetSummaryAsync(cancellationToken);
        return Ok(ApiResponse.Success(summary));
    }

    [HttpGet("channels")]
    [ProducesResponseType(typeof(ApiResponse<List<ChannelHealthDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<ChannelHealthDto>>>> GetChannelHealth(CancellationToken cancellationToken)
    {
        var channels = await _notificationService.GetChannelHealthAsync(cancellationToken);
        return Ok(ApiResponse.Success(channels));
    }

    [HttpPost("{id}/read")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(string id, CancellationToken cancellationToken)
    {
        var success = await _notificationService.MarkAsReadAsync(id, cancellationToken);
        return Ok(ApiResponse.Success(success));
    }

    [HttpPost("read-all")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAllAsRead(CancellationToken cancellationToken)
    {
        var success = await _notificationService.MarkAllAsReadAsync(cancellationToken);
        return Ok(ApiResponse.Success(success));
    }
}
