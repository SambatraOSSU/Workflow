using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.DTOs.Auth;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Identity;

namespace Vanguard.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITenantRepository _tenantRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IUnitOfWork _unitOfWork;

    public AuthService(
        IUserRepository userRepository,
        ITenantRepository tenantRepository,
        IPasswordHasher passwordHasher,
        IJwtTokenGenerator jwtTokenGenerator,
        IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _tenantRepository = tenantRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _unitOfWork = unitOfWork;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Identifiants de connexion invalides.");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("Ce compte utilisateur est désactivé.");
        }

        var tenant = await _tenantRepository.GetByIdAsync(user.TenantId, cancellationToken);
        if (tenant == null || !tenant.IsActive)
        {
            throw new UnauthorizedAccessException("L'organisation associée est inactive ou introuvable.");
        }

        user.LastLoginAtUtc = DateTime.UtcNow;
        await _unitOfWork.CommitAsync(cancellationToken);

        var (token, expiresAt) = _jwtTokenGenerator.GenerateToken(user, tenant);

        return new LoginResponseDto(
            token,
            expiresAt,
            user.Id,
            user.Email,
            user.FullName,
            user.Role.ToString(),
            tenant.Id,
            tenant.Name,
            tenant.Slug);
    }

    public async Task<LoginResponseDto> RegisterTenantAsync(RegisterTenantRequestDto request, CancellationToken cancellationToken = default)
    {
        var slugExists = await _tenantRepository.ExistsSlugAsync(request.OrganizationSlug, cancellationToken);
        if (slugExists)
        {
            throw new InvalidOperationException($"L'identifiant d'organisation '{request.OrganizationSlug}' est déjà utilisé.");
        }

        var emailExists = await _userRepository.ExistsAsync(request.AdminEmail, cancellationToken);
        if (emailExists)
        {
            throw new InvalidOperationException($"L'adresse email '{request.AdminEmail}' est déjà enregistrée.");
        }

        var tenant = new Tenant
        {
            Name = request.OrganizationName,
            Slug = request.OrganizationSlug.ToLowerInvariant(),
            IsActive = true
        };

        await _tenantRepository.AddAsync(tenant, cancellationToken);

        var adminUser = new User
        {
            TenantId = tenant.Id,
            Email = request.AdminEmail,
            FullName = request.AdminFullName,
            PasswordHash = _passwordHasher.HashPassword(request.AdminPassword),
            Role = UserRole.OrgAdmin,
            Department = "Executive / Administration",
            IsActive = true
        };

        await _userRepository.AddAsync(adminUser, cancellationToken);
        await _unitOfWork.CommitAsync(cancellationToken);

        var (token, expiresAt) = _jwtTokenGenerator.GenerateToken(adminUser, tenant);

        return new LoginResponseDto(
            token,
            expiresAt,
            adminUser.Id,
            adminUser.Email,
            adminUser.FullName,
            adminUser.Role.ToString(),
            tenant.Id,
            tenant.Name,
            tenant.Slug);
    }
}
