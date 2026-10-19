using Vanguard.Domain.Common;

namespace Vanguard.Domain.Entities.Engine;

public class ExecutionStepLog : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Guid ExecutionInstanceId { get; set; }
    public string StepKey { get; set; } = string.Empty;
    public string StepName { get; set; } = string.Empty;
    public string StepType { get; set; } = string.Empty; // Start, HumanTask, AutomatedTask, Condition, Approval, Notification, End
    public string Status { get; set; } = "Succeeded"; // Executing, Succeeded, Failed, Skipped
    public long ExecutionDurationMs { get; set; }
    public string InputPayloadJson { get; set; } = "{}";
    public string OutputPayloadJson { get; set; } = "{}";
    public string? ErrorMessage { get; set; }

    public ExecutionInstance? ExecutionInstance { get; set; }
}
