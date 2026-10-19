using Vanguard.Application.DTOs.Auth;

namespace Vanguard.Application.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
    Task<LoginResponseDto> RegisterTenantAsync(RegisterTenantRequestDto request, CancellationToken cancellationToken = default);
}
