using Vanguard.Application.DTOs.Notification;
using Vanguard.Application.Interfaces;

namespace Vanguard.Application.Services;

public class NotificationService : INotificationService
{
    private static readonly List<NotificationDto> _notifications = new()
    {
        new()
        {
            Id = "notif-001",
            Type = "CRITICAL SLA BREACH",
            Category = "sla",
            Severity = "critical",
            Title = "Workflow wf-ledger-sync SLA Target Exceeded",
            Message = "Persistent lock contention encountered on fin_general_ledger_q4 during batch reconciliations. PagerDuty P1 incident automatically raised to on-call roster.",
            RelativeTime = "3 mins ago",
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-3),
            IncidentId = "#INC-80924",
            Resource = "fin_general_ledger_q4",
            IsRead = false,
            Diagnostics = new Dictionary<string, string>
            {
                { "Assigned", "DataOps Primary Escalation" },
                { "Cluster", "us-east-1-prod-c02" },
                { "Recovery Window", "17m remaining before cascade" }
            },
            Actions = new List<NotificationActionDto>
            {
                new() { Label = "Inspect Trace Log", Action = "inspect_trace", Variant = "primary" },
                new() { Label = "Acknowledge", Action = "acknowledge", Variant = "secondary" },
                new() { Label = "Escalate to VP Ops", Action = "escalate", Variant = "danger" }
            }
        },
        new()
        {
            Id = "notif-002",
            Type = "PENDING URGENT APPROVAL",
            Category = "approval",
            Severity = "warning",
            Title = "Global AWS Infrastructure Expansion PO #88319 ($124,500.00)",
            Message = "Reserved Instance renewal for Kubernetes compute node cluster group k8s-prod-primary-eu. Requester: Kenji Sato (Cloud Architecture Lead).",
            RelativeTime = "14 mins ago",
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-14),
            IncidentId = "PO #88319",
            Resource = "k8s-prod-primary-eu",
            Amount = "$124,500.00",
            IsRead = false,
            Diagnostics = new Dictionary<string, string>
            {
                { "Auto-escalation", "in 1h 48m" },
                { "Budget Status", "Within Q4 CapEx Budget" },
                { "Signatures", "2/3 Signatures Collected" }
            },
            Actions = new List<NotificationActionDto>
            {
                new() { Label = "Review & Sign", Action = "review_sign", Variant = "primary" },
                new() { Label = "Delegate Sign-off", Action = "delegate", Variant = "secondary" }
            }
        },
        new()
        {
            Id = "notif-003",
            Type = "SECURITY POLICY ALERT",
            Category = "security",
            Severity = "critical",
            Title = "Unauthorized CapEx Bypass Attempt Blocked",
            Message = "Autonomous Policy Engine intervened on task execution from service identity svc-batch-billing@vanguard.internal. Role lacked secondary cryptographic attestation for tier-1 disbursement.",
            RelativeTime = "48 mins ago",
            CreatedAtUtc = DateTime.UtcNow.AddMinutes(-48),
            IncidentId = "#AUD-994129",
            Resource = "svc-batch-billing@vanguard.internal",
            IsRead = false,
            Diagnostics = new Dictionary<string, string>
            {
                { "Enclave ID", "#AUD-994129" },
                { "Status", "Auto-Intercepted" },
                { "Gateway", "zero-trust-gw-01" }
            },
            Actions = new List<NotificationActionDto>
            {
                new() { Label = "View Audit Enclave Log", Action = "view_audit", Variant = "secondary" },
                new() { Label = "Report to InfoSec", Action = "report_infosec", Variant = "secondary" }
            }
        },
        new()
        {
            Id = "notif-004",
            Type = "DEPLOYMENT SUCCESSFUL",
            Category = "system",
            Severity = "info",
            Title = "Pipeline wf-procurement-v2.4 Deployed to US-East-1 Prod",
            Message = "Blue/green traffic cutover completed with zero dropped requests. Automated smoke test suite passed with 100% assertions across 48 integration vectors.",
            RelativeTime = "2 hours ago",
            CreatedAtUtc = DateTime.UtcNow.AddHours(-2),
            IncidentId = "Release v2.4.11",
            Resource = "wf-procurement-v2.4",
            IsRead = false,
            Diagnostics = new Dictionary<string, string>
            {
                { "Commit", "8fd29ab" },
                { "Triggered by", "Devon Ramos" }
            },
            Actions = new List<NotificationActionDto>()
        },
        new()
        {
            Id = "notif-005",
            Type = "WEBHOOK RETRY SPIKE",
            Category = "system",
            Severity = "warning",
            Title = "SAP Invoice Dispatch Retrying with Elevated Latency",
            Message = "Remote edge proxy responded with HTTP 429 Rate Limiting on secondary invoice payload sync. Backoff schedule activated (Attempt 3/5).",
            RelativeTime = "3 hours ago",
            CreatedAtUtc = DateTime.UtcNow.AddHours(-3),
            IncidentId = "Partner API: SAP S/4HANA",
            Resource = "SAP S/4HANA Edge Proxy",
            IsRead = false,
            Diagnostics = new Dictionary<string, string>
            {
                { "Latency", "850ms" },
                { "Next retry", "in 4m 12s" }
            },
            Actions = new List<NotificationActionDto>
            {
                new() { Label = "Force Immediate Retry", Action = "force_retry", Variant = "secondary" },
                new() { Label = "View Rate Limits", Action = "view_limits", Variant = "secondary" }
            }
        }
    };

    public Task<List<NotificationDto>> GetNotificationsAsync(
        string? category = null, 
        string? severity = null, 
        bool? unreadOnly = null, 
        string? searchTerm = null, 
        CancellationToken cancellationToken = default)
    {
        var query = _notifications.AsQueryable();

        if (unreadOnly.HasValue && unreadOnly.Value)
        {
            query = query.Where(n => !n.IsRead);
        }

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(n => n.Category.Equals(category, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(severity) && !severity.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(n => n.Severity.Equals(severity, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var search = searchTerm.Trim().ToLowerInvariant();
            query = query.Where(n => 
                n.Title.ToLowerInvariant().Contains(search) || 
                n.Message.ToLowerInvariant().Contains(search) ||
                (n.IncidentId != null && n.IncidentId.ToLowerInvariant().Contains(search)));
        }

        return Task.FromResult(query.OrderByDescending(n => n.CreatedAtUtc).ToList());
    }

    public Task<NotificationSummaryDto> GetSummaryAsync(CancellationToken cancellationToken = default)
    {
        var unread = _notifications.Count(n => !n.IsRead);
        var critical = _notifications.Count(n => n.Severity == "critical");
        var approvals = _notifications.Count(n => n.Category == "approval");

        return Task.FromResult(new NotificationSummaryDto
        {
            UnreadCount = unread,
            CriticalIncidentsCount = critical,
            PendingApprovalsCount = approvals,
            PipelineTelemetryCount = 24,
            RateCapacityPercent = 34.2,
            RateCapacityCurrent = 342,
            RateCapacityMax = 1000,
            QuietHoursActive = true,
            DispatchedCount24h = 14291,
            SlaDeliveryRate = 99.98,
            AvgAckLatency = "1.4m"
        });
    }

    public Task<List<ChannelHealthDto>> GetChannelHealthAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(new List<ChannelHealthDto>
        {
            new() { Id = "in-app", Name = "In-App Web Console", Description = "Persistent WebSocket (0 drop)", Status = "Active", IsHealthy = true },
            new() { Id = "slack", Name = "Slack #eng-war-room", Description = "High-priority alerts & pings", Status = "Active", IsHealthy = true },
            new() { Id = "pagerduty", Name = "PagerDuty Escalation", Description = "P1/P2 On-Call Ringing", Status = "Active", IsHealthy = true },
            new() { Id = "email", Name = "Executive Email Digest", Description = "Daily Schedule @ 08:00 UTC", Status = "Active", IsHealthy = true },
            new() { Id = "webhook", Name = "HMAC Webhook", Description = "api.vanguard.corp/events", Status = "Active", IsHealthy = true }
        });
    }

    public Task<bool> MarkAsReadAsync(string notificationId, CancellationToken cancellationToken = default)
    {
        var item = _notifications.FirstOrDefault(n => n.Id == notificationId);
        if (item != null)
        {
            item.IsRead = true;
            return Task.FromResult(true);
        }
        return Task.FromResult(false);
    }

    public Task<bool> MarkAllAsReadAsync(CancellationToken cancellationToken = default)
    {
        foreach (var item in _notifications)
        {
            item.IsRead = true;
        }
        return Task.FromResult(true);
    }
}
