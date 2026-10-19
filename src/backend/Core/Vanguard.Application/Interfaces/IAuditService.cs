using Vanguard.Application.DTOs.Audit;

namespace Vanguard.Application.Interfaces;

public interface IAuditService
{
    Task<List<AuditLedgerEntryDto>> GetLedgerEntriesAsync(string? searchTerm = null, string? category = null, string? severity = null, CancellationToken cancellationToken = default);
    Task<AuditMetricsDto> GetMetricsAsync(CancellationToken cancellationToken = default);
    Task<ComplianceCertificateDto> GenerateCertificateAsync(CancellationToken cancellationToken = default);
    Task<bool> VerifyEntryHashAsync(Guid entryId, CancellationToken cancellationToken = default);
}
