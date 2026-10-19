using Vanguard.Domain.Common;

namespace Vanguard.Domain.Entities.Workflows;

public class WorkflowVersion : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Guid WorkflowDefinitionId { get; set; }
    public int VersionNumber { get; set; }
    public string GraphDefinitionJson { get; set; } = "{}";
    public string HashSha256 { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime PublishedAtUtc { get; set; } = DateTime.UtcNow;
    public Guid? PublishedByUserId { get; set; }

    public WorkflowDefinition? WorkflowDefinition { get; set; }
}
