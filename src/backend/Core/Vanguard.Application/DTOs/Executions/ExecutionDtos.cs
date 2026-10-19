using Vanguard.Domain.Entities.Engine;

namespace Vanguard.Application.DTOs.Executions;

public record StartExecutionRequestDto(
    Guid WorkflowDefinitionId,
    string? TriggerSource,
    string PayloadJson
);

public record ExecutionStepLogDto(
    Guid Id,
    string StepKey,
    string StepName,
    string StepType,
    string Status,
    long ExecutionDurationMs,
    string InputPayloadJson,
    string OutputPayloadJson,
    string? ErrorMessage,
    DateTime CreatedAtUtc
);

public record ExecutionInstanceSummaryDto(
    Guid Id,
    Guid WorkflowDefinitionId,
    string WorkflowTitle,
    string WorkflowKey,
    string ReferenceNumber,
    ExecutionStatus Status,
    string CurrentStepKey,
    string TriggerSource,
    DateTime StartedAtUtc,
    DateTime? CompletedAtUtc,
    int StepCount
);

public record ExecutionInstanceDetailDto(
    Guid Id,
    Guid WorkflowDefinitionId,
    Guid WorkflowVersionId,
    string WorkflowTitle,
    string WorkflowKey,
    string ReferenceNumber,
    ExecutionStatus Status,
    string CurrentStepKey,
    string PayloadJson,
    string TriggerSource,
    Guid? InitiatorUserId,
    DateTime StartedAtUtc,
    DateTime? CompletedAtUtc,
    IReadOnlyList<ExecutionStepLogDto> StepLogs
);
