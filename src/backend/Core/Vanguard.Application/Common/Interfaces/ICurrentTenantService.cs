namespace Vanguard.Application.Common.Interfaces;

public interface ICurrentTenantService
{
    Guid? TenantId { get; }
    string? TenantSlug { get; }
    void SetTenant(Guid tenantId, string? slug = null);
}
