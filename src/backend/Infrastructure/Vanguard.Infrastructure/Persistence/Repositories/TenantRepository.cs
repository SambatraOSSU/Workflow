using Microsoft.EntityFrameworkCore;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Identity;

namespace Vanguard.Infrastructure.Persistence.Repositories;

public class TenantRepository : ITenantRepository
{
    private readonly VanguardDbContext _context;

    public TenantRepository(VanguardDbContext context)
    {
        _context = context;
    }

    public async Task<Tenant?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Tenants.FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public async Task<Tenant?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _context.Tenants.FirstOrDefaultAsync(t => t.Slug.ToLower() == slug.ToLower(), cancellationToken);
    }

    public async Task AddAsync(Tenant tenant, CancellationToken cancellationToken = default)
    {
        await _context.Tenants.AddAsync(tenant, cancellationToken);
    }

    public async Task<bool> ExistsSlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _context.Tenants.AnyAsync(t => t.Slug.ToLower() == slug.ToLower(), cancellationToken);
    }
}
