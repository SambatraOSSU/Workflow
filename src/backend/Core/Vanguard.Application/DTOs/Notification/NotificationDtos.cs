namespace Vanguard.Application.DTOs.Notification;

public class NotificationActionDto
{
    public string Label { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Variant { get; set; } = "primary"; // primary, secondary, danger
}

public class NotificationDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // CRITICAL SLA BREACH, PENDING URGENT APPROVAL, etc.
    public string Category { get; set; } = "system"; // sla, approval, security, system
    public string Severity { get; set; } = "info"; // critical, warning, high, info
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string RelativeTime { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public string? IncidentId { get; set; }
    public string? Resource { get; set; }
    public string? Amount { get; set; }
    public bool IsRead { get; set; }
    public List<NotificationActionDto> Actions { get; set; } = new();
    public Dictionary<string, string> Diagnostics { get; set; } = new();
}

public class ChannelHealthDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public bool IsHealthy { get; set; } = true;
}

public class NotificationSummaryDto
{
    public int UnreadCount { get; set; } = 5;
    public int CriticalIncidentsCount { get; set; } = 2;
    public int PendingApprovalsCount { get; set; } = 7;
    public int PipelineTelemetryCount { get; set; } = 24;
    public double RateCapacityPercent { get; set; } = 34.2;
    public int RateCapacityCurrent { get; set; } = 342;
    public int RateCapacityMax { get; set; } = 1000;
    public bool QuietHoursActive { get; set; } = true;
    public int DispatchedCount24h { get; set; } = 14291;
    public double SlaDeliveryRate { get; set; } = 99.98;
    public string AvgAckLatency { get; set; } = "1.4m";
}
