using Vanguard.Application.DTOs.Notification;

namespace Vanguard.Application.Interfaces;

public interface INotificationService
{
    Task<List<NotificationDto>> GetNotificationsAsync(string? category = null, string? severity = null, bool? unreadOnly = null, string? searchTerm = null, CancellationToken cancellationToken = default);
    Task<NotificationSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default);
    Task<List<ChannelHealthDto>> GetChannelHealthAsync(CancellationToken cancellationToken = default);
    Task<bool> MarkAsReadAsync(string notificationId, CancellationToken cancellationToken = default);
    Task<bool> MarkAllAsReadAsync(CancellationToken cancellationToken = default);
}
