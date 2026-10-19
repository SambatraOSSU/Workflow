using Vanguard.Application.DTOs.Workflows;

namespace Vanguard.Application.Interfaces;

public interface IWorkflowService
{
    Task<List<WorkflowSummaryDto>> GetWorkflowsAsync(string? category = null, string? search = null, CancellationToken cancellationToken = default);
    Task<WorkflowDetailDto?> GetWorkflowByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<WorkflowSummaryDto> CreateWorkflowAsync(CreateWorkflowRequestDto dto, Guid userId, CancellationToken cancellationToken = default);
    Task<WorkflowSummaryDto> UpdateWorkflowAsync(Guid id, UpdateWorkflowRequestDto dto, CancellationToken cancellationToken = default);
    Task<GraphValidationResultDto> ValidateGraphAsync(SaveWorkflowGraphRequestDto dto, CancellationToken cancellationToken = default);
    Task<WorkflowDetailDto> SaveDraftGraphAsync(Guid id, SaveWorkflowGraphRequestDto dto, Guid userId, CancellationToken cancellationToken = default);
    Task<WorkflowVersionDto> PublishVersionAsync(Guid id, PublishWorkflowVersionRequestDto dto, Guid userId, CancellationToken cancellationToken = default);
    Task<List<WorkflowVersionSummaryDto>> GetWorkflowVersionsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<WorkflowVersionDto?> GetWorkflowVersionAsync(Guid id, int versionNumber, CancellationToken cancellationToken = default);
}
