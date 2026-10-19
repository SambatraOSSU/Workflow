using Vanguard.Domain.Common;

namespace Vanguard.Domain.Entities.Identity;

public class Tenant : BaseEntity, ISoftDeletable
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ClusterRegion { get; set; } = "us-east-1";
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAtUtc { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();
}
