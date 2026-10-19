namespace Vanguard.Application.Common.Models;

public class ApiResponse<T>
{
    public bool Success { get; init; }
    public string Message { get; init; } = string.Empty;
    public T? Data { get; init; }
    public IDictionary<string, string[]>? Errors { get; init; }
    public string? TraceId { get; init; }

    public static ApiResponse<T> SuccessResponse(T? data, string message = "Success") => new()
    {
        Success = true,
        Message = message,
        Data = data
    };

    public static ApiResponse<T> FailureResponse(string message, IDictionary<string, string[]>? errors = null, string? traceId = null) => new()
    {
        Success = false,
        Message = message,
        Errors = errors,
        TraceId = traceId
    };
}

public static class ApiResponse
{
    public static ApiResponse<T> Success<T>(T? data, string message = "Success") =>
        ApiResponse<T>.SuccessResponse(data, message);

    public static ApiResponse<T> Failure<T>(string message, IDictionary<string, string[]>? errors = null, string? traceId = null) =>
        ApiResponse<T>.FailureResponse(message, errors, traceId);
}
