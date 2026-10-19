using Vanguard.Domain.Common;
using Vanguard.Domain.Entities.Engine;

namespace Vanguard.Domain.Entities.Tasks;

public class TaskInstance : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Guid ExecutionInstanceId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string StepKey { get; set; } = string.Empty;
    public Guid? AssignedToUserId { get; set; }
    public string? AssignedToRole { get; set; }
    public string? AssignedToDepartment { get; set; }
    public string Priority { get; set; } = "Medium"; // Low, Medium, High, Urgent
    public TaskStatus Status { get; set; } = TaskStatus.Pending;
    public DateTime? DueAtUtc { get; set; }
    public int? SlaHours { get; set; }
    public string ConsensusPolicy { get; set; } = "Single"; // Single, FourEyes, Majority, Unanimous
    public DateTime? ActionTakenAtUtc { get; set; }
    public Guid? ActionTakenByUserId { get; set; }
    public string? DecisionNotes { get; set; }

    public byte[] RowVersion { get; set; } = Array.Empty<byte>();

    public ExecutionInstance? ExecutionInstance { get; set; }
}
