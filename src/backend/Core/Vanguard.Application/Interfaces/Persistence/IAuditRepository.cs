using Vanguard.Domain.Entities.Audit;

namespace Vanguard.Application.Interfaces.Persistence;

public interface IAuditRepository
{
    Task AppendEntryAsync(AuditLedgerEntry entry, CancellationToken cancellationToken = default);
    Task<string> GetLastHashAsync(Guid tenantId, CancellationToken cancellationToken = default);
    Task<List<AuditLedgerEntry>> GetRecentEntriesAsync(int count = 50, CancellationToken cancellationToken = default);
}
