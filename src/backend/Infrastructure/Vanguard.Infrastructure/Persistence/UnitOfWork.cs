using Vanguard.Application.Common.Interfaces;

namespace Vanguard.Infrastructure.Persistence;

public class UnitOfWork : IUnitOfWork
{
    private readonly VanguardDbContext _context;

    public UnitOfWork(VanguardDbContext context)
    {
        _context = context;
    }

    public async Task<int> CommitAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }
}
