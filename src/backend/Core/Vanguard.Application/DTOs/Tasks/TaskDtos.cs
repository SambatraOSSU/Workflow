using TaskStatus = Vanguard.Domain.Entities.Tasks.TaskStatus;

namespace Vanguard.Application.DTOs.Tasks;

public record TaskSummaryDto(
    Guid Id,
    Guid ExecutionInstanceId,
    string WorkflowReferenceNumber,
    string WorkflowTitle,
    string Title,
    string Description,
    string StepKey,
    string? AssignedToUserName,
    string? AssignedToRole,
    string? AssignedToDepartment,
    string Priority,
    TaskStatus Status,
    DateTime? DueAtUtc,
    int? SlaHours,
    string ConsensusPolicy,
    int SecondsRemaining,
    DateTime CreatedAtUtc
);

public record TaskDetailDto(
    Guid Id,
    Guid ExecutionInstanceId,
    string WorkflowReferenceNumber,
    string WorkflowTitle,
    string Title,
    string Description,
    string StepKey,
    string PayloadJson,
    Guid? AssignedToUserId,
    string? AssignedToUserName,
    string? AssignedToRole,
    string? AssignedToDepartment,
    string Priority,
    TaskStatus Status,
    DateTime? DueAtUtc,
    int? SlaHours,
    string ConsensusPolicy,
    int SecondsRemaining,
    DateTime? ActionTakenAtUtc,
    string? DecisionNotes,
    DateTime CreatedAtUtc
);

public record ApproveTaskRequestDto(
    string? DecisionNotes,
    string? WebAuthnSignature
);

public record RejectTaskRequestDto(
    string RejectionReason,
    string? RejectionCode
);

public record DelegateTaskRequestDto(
    string DelegateToUserEmail,
    string? DelegateNotes
);
