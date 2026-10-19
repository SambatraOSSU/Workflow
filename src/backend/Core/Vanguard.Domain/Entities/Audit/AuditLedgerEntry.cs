using Vanguard.Domain.Common;

namespace Vanguard.Domain.Entities.Audit;

public class AuditLedgerEntry : BaseEntity, ITenantScoped
{
    public Guid TenantId { get; set; }
    public Guid? ExecutionInstanceId { get; set; }
    public string EventType { get; set; } = string.Empty; // Transition, Approval, Publication, SecurityBreach, UserLogin
    public string ActorEmail { get; set; } = string.Empty;
    public string ActorRole { get; set; } = string.Empty;
    public string DetailsJson { get; set; } = "{}";
    public string PreviousHashSha256 { get; set; } = string.Empty;
    public string CurrentHashSha256 { get; set; } = string.Empty;
    public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
    public bool IsVerified { get; set; } = true;
}
