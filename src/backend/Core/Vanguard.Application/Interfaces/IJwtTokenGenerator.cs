using Vanguard.Domain.Entities.Identity;

namespace Vanguard.Application.Interfaces;

public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAtUtc) GenerateToken(User user, Tenant tenant);
}
