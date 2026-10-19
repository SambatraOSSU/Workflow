using Vanguard.Domain.Common;

namespace Vanguard.Domain.Entities.Workflows;

public class WorkflowDefinition : BaseEntity, ITenantScoped, ISoftDeletable
{
    public Guid TenantId { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public int CurrentVersionNumber { get; set; } = 1;
    public WorkflowStatus Status { get; set; } = WorkflowStatus.Draft;
    public string Category { get; set; } = "General"; // e.g. IT, Finance, HR
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAtUtc { get; set; }

    public ICollection<WorkflowVersion> Versions { get; set; } = new List<WorkflowVersion>();
}
