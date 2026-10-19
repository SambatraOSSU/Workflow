using Vanguard.Application.DTOs.Executions;
using Vanguard.Domain.Entities.Engine;

namespace Vanguard.Application.Interfaces;

public interface IWorkflowEngine
{
    Task<ExecutionInstanceSummaryDto> StartWorkflowAsync(StartExecutionRequestDto request, Guid? userId, CancellationToken cancellationToken = default);
    Task<ExecutionInstanceDetailDto?> GetExecutionByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<ExecutionInstanceSummaryDto>> GetExecutionsAsync(ExecutionStatus? status = null, Guid? workflowDefinitionId = null, string? search = null, CancellationToken cancellationToken = default);
    Task AdvanceWorkflowAsync(Guid executionInstanceId, string currentStepKey, string outputPayloadJson, CancellationToken cancellationToken = default);
}
