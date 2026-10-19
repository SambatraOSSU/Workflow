using Vanguard.Domain.Common;
using Vanguard.Domain.Entities.Workflows;

namespace Vanguard.Domain.Entities.Engine;

public class ExecutionInstance : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Guid WorkflowDefinitionId { get; set; }
    public Guid WorkflowVersionId { get; set; }
    public string ReferenceNumber { get; set; } = string.Empty; // e.g. RUN-2026-00481
    public ExecutionStatus Status { get; set; } = ExecutionStatus.Pending;
    public string CurrentStepKey { get; set; } = string.Empty;
    public string PayloadJson { get; set; } = "{}";
    public DateTime StartedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAtUtc { get; set; }
    public string TriggerSource { get; set; } = "Manual"; // Webhook, Manual, Scheduled, Event
    public Guid? InitiatorUserId { get; set; }

    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public WorkflowDefinition? WorkflowDefinition { get; set; }
    public WorkflowVersion? WorkflowVersion { get; set; }
    public ICollection<ExecutionStepLog> StepLogs { get; set; } = new List<ExecutionStepLog>();
}
