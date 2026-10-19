using Vanguard.Domain.Entities.Workflows;

namespace Vanguard.Application.DTOs.Workflows;

public record WorkflowSummaryDto(
    Guid Id,
    string Key,
    string Title,
    string Description,
    string Department,
    string Category,
    int CurrentVersionNumber,
    WorkflowStatus Status,
    bool IsActive,
    int NodeCount,
    DateTime? UpdatedAtUtc,
    DateTime CreatedAtUtc
);

public record WorkflowDetailDto(
    Guid Id,
    string Key,
    string Title,
    string Description,
    string Department,
    string Category,
    int CurrentVersionNumber,
    WorkflowStatus Status,
    bool IsActive,
    DateTime? UpdatedAtUtc,
    DateTime CreatedAtUtc,
    WorkflowVersionDto? ActiveVersion,
    IReadOnlyList<WorkflowVersionSummaryDto> Versions
);

public record WorkflowVersionSummaryDto(
    Guid Id,
    int VersionNumber,
    string HashSha256,
    bool IsActive,
    DateTime PublishedAtUtc,
    string? PublishedByName
);

public record WorkflowVersionDto(
    Guid Id,
    Guid WorkflowDefinitionId,
    int VersionNumber,
    string GraphDefinitionJson,
    string HashSha256,
    bool IsActive,
    DateTime PublishedAtUtc,
    Guid? PublishedByUserId,
    string? PublishedByName
);

public record NodePositionDto(double X, double Y);

public record NodeConfigDto(
    string? Prompt = null,
    string? ConsensusPolicy = null, // "FourEyes", "Majority", "Unanimous", "Single"
    List<string>? AssignedRoles = null,
    int TargetSlaHours = 4,
    string? EscalationPath = null,
    bool RequireMfa = false,
    bool AllowRejection = true,
    string? NotificationTarget = null,
    string? ConditionExpression = null,
    string? EventName = null,
    string? Engine = null,
    string? Algo = null,
    string? Topic = null,
    string? CronExpression = null
);

public record WorkflowNodeDto(
    string Id,
    string Type, // "trigger", "task", "gate", "integration", "end"
    string SubType, // "webhook", "cron", "kafka", "approval", "consensus", "doc-sign", "condition", "worker", "subflow", "sap", "vault", "slack"
    string Label,
    string? Description,
    NodePositionDto Position,
    NodeConfigDto? Config
);

public record WorkflowEdgeDto(
    string Id,
    string From,
    string To,
    string? Label,
    string? Condition,
    string? Style // "navy", "orange", "green", "dashed"
);

public record WorkflowGraphDto(
    List<WorkflowNodeDto> Nodes,
    List<WorkflowEdgeDto> Edges
);

public record CreateWorkflowRequestDto(
    string Key,
    string Title,
    string Description,
    string Department,
    string Category
);

public record UpdateWorkflowRequestDto(
    string Title,
    string Description,
    string Department,
    string Category,
    WorkflowStatus Status
);

public record SaveWorkflowGraphRequestDto(
    string GraphDefinitionJson
);

public record PublishWorkflowVersionRequestDto(
    string? ChangeNotes
);

public record PublishWorkflowRequestDto(
    string? ChangeNotes
);

public record GraphValidationResultDto(
    bool IsValid,
    List<string> Errors,
    List<string> Warnings,
    int NodeCount,
    int BranchCount,
    int CycleCount,
    string TopologySummary
);
