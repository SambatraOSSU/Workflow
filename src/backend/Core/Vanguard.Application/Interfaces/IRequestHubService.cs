using Vanguard.Application.DTOs.Requests;

namespace Vanguard.Application.Interfaces;

public interface IRequestHubService
{
    Task<List<CatalogTemplateDto>> GetCatalogTemplatesAsync(CancellationToken cancellationToken = default);
    Task<List<ServiceRequestSummaryDto>> GetRequestsAsync(string? status, string? department, string? search, CancellationToken cancellationToken = default);
    Task<ServiceRequestDetailDto?> GetRequestByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ServiceRequestSummaryDto> SubmitRequestAsync(SubmitCatalogRequestDto request, Guid? userId, CancellationToken cancellationToken = default);
    Task<bool> ExpediteSlaAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> RejectRequestAsync(Guid id, string reason, CancellationToken cancellationToken = default);
}
