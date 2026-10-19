namespace Vanguard.Application.DTOs.Requests;

public record CatalogTemplateDto(
    string TemplateId,
    string Title,
    string Category,
    string Description,
    string TargetSla,
    string Badge,
    decimal DefaultBudget,
    string Icon);

public record SubmitCatalogRequestDto(
    string TemplateId,
    string Title,
    string Department,
    decimal EstimatedBudget,
    Dictionary<string, string> Parameters);

public record ServiceRequestSummaryDto(
    Guid Id,
    string RequestNumber,
    string Title,
    string WorkflowKey,
    string RequesterName,
    string RequesterDepartment,
    string RequesterInitials,
    string CurrentStage,
    string CurrentOwner,
    int CurrentStepNumber,
    int TotalSteps,
    decimal EstimatedBudget,
    string RemainingTimeFormatted,
    int ProgressPercent,
    string Status,
    DateTime CreatedAtUtc);

public record RequestTimelineStepDto(
    int StepNumber,
    string Title,
    string Description,
    string Status, // Done, Active, Future
    string TimestampFormatted);

public record AttachedDocumentDto(
    string FileName,
    string FileSize,
    string FileType);

public record ServiceRequestDetailDto(
    Guid Id,
    string RequestNumber,
    string Title,
    string WorkflowKey,
    string RequesterName,
    string RequesterDepartment,
    string RequesterInitials,
    string CurrentStage,
    string CurrentOwner,
    int CurrentStepNumber,
    int TotalSteps,
    decimal EstimatedBudget,
    string RemainingTimeFormatted,
    int ProgressPercent,
    string Status,
    DateTime CreatedAtUtc,
    List<RequestTimelineStepDto> Timeline,
    Dictionary<string, string> Parameters,
    List<AttachedDocumentDto> AttachedDocuments);
