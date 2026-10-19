using Vanguard.Domain.Entities.Identity;

namespace Vanguard.Application.Interfaces.Persistence;

public interface ITenantRepository
{
    Task<Tenant?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Tenant?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task AddAsync(Tenant tenant, CancellationToken cancellationToken = default);
    Task<bool> ExistsSlugAsync(string slug, CancellationToken cancellationToken = default);
}
