namespace Vanguard.Application.DTOs.Auth;

public record LoginRequestDto(string Email, string Password);

public record LoginResponseDto(
    string Token,
    DateTime ExpiresAtUtc,
    Guid UserId,
    string Email,
    string FullName,
    string Role,
    Guid TenantId,
    string TenantName,
    string TenantSlug);

public record RegisterTenantRequestDto(
    string OrganizationName,
    string OrganizationSlug,
    string AdminEmail,
    string AdminPassword,
    string AdminFullName);
