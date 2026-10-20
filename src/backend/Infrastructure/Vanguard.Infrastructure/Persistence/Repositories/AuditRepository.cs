using Microsoft.EntityFrameworkCore;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Audit;

namespace Vanguard.Infrastructure.Persistence.Repositories;

public class AuditRepository : IAuditRepository
{
    private readonly VanguardDbContext _context;

    public AuditRepository(VanguardDbContext context)
    {
        _context = context;
    }

    public async Task AppendEntryAsync(AuditLedgerEntry entry, CancellationToken cancellationToken = default)
    {
        await _context.AuditLedgerEntries.AddAsync(entry, cancellationToken);
    }

    public async Task<string> GetLastHashAsync(Guid tenantId, CancellationToken cancellationToken = default)
    {
        var lastHash = await _context.AuditLedgerEntries
            .Where(a => a.TenantId == tenantId)
            .OrderByDescending(a => a.TimestampUtc)
            .Select(a => a.CurrentHashSha256)
            .FirstOrDefaultAsync(cancellationToken);

        return lastHash ?? "0000000000000000000000000000000000000000000000000000000000000000";
    }

    public Task<List<AuditLedgerEntry>> GetRecentEntriesAsync(int count = 50, CancellationToken cancellationToken = default)
    {
        return _context.AuditLedgerEntries
            .AsNoTracking()
            .OrderByDescending(a => a.TimestampUtc)
            .Take(count)
            .ToListAsync(cancellationToken);
    }
}
