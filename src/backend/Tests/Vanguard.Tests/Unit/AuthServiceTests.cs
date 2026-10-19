using FluentAssertions;
using Moq;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.DTOs.Auth;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Application.Services;
using Vanguard.Domain.Entities.Identity;
using Xunit;

namespace Vanguard.Tests.Unit;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<ITenantRepository> _tenantRepoMock = new();
    private readonly Mock<IPasswordHasher> _passwordHasherMock = new();
    private readonly Mock<IJwtTokenGenerator> _jwtGeneratorMock = new();
    private readonly Mock<IUnitOfWork> _unitOfWorkMock = new();

    private readonly AuthService _sut;

    public AuthServiceTests()
    {
        _sut = new AuthService(
            _userRepoMock.Object,
            _tenantRepoMock.Object,
            _passwordHasherMock.Object,
            _jwtGeneratorMock.Object,
            _unitOfWorkMock.Object);
    }

    [Fact]
    public async Task LoginAsync_Should_Return_Token_When_Credentials_Are_Valid()
    {
        // Arrange
        var tenantId = Guid.NewGuid();
        var user = new User
        {
            Id = Guid.NewGuid(),
            TenantId = tenantId,
            Email = "alexander.vance@vanguard.io",
            FullName = "Alexander Vance",
            Role = UserRole.OrgAdmin,
            PasswordHash = "hashed_pw",
            IsActive = true
        };

        var tenant = new Tenant
        {
            Id = tenantId,
            Name = "Vanguard HQ",
            Slug = "vanguard-hq",
            IsActive = true
        };

        _userRepoMock.Setup(r => r.GetByEmailAsync("alexander.vance@vanguard.io", It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _passwordHasherMock.Setup(h => h.VerifyPassword("Password123!", "hashed_pw"))
            .Returns(true);

        _tenantRepoMock.Setup(r => r.GetByIdAsync(tenantId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(tenant);

        var expiresAt = DateTime.UtcNow.AddHours(12);
        _jwtGeneratorMock.Setup(j => j.GenerateToken(user, tenant))
            .Returns(("jwt_mock_token_abc123", expiresAt));

        // Act
        var request = new LoginRequestDto("alexander.vance@vanguard.io", "Password123!");
        var response = await _sut.LoginAsync(request);

        // Assert
        response.Should().NotBeNull();
        response.Token.Should().Be("jwt_mock_token_abc123");
        response.Email.Should().Be("alexander.vance@vanguard.io");
        response.TenantSlug.Should().Be("vanguard-hq");
        _unitOfWorkMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_Should_Throw_Unauthorized_When_User_Not_Found()
    {
        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);

        var act = () => _sut.LoginAsync(new LoginRequestDto("unknown@vanguard.io", "Password123!"));

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Identifiants de connexion invalides.");
    }

    [Fact]
    public async Task LoginAsync_Should_Throw_Unauthorized_When_Password_Is_Wrong()
    {
        var user = new User
        {
            Email = "alexander.vance@vanguard.io",
            PasswordHash = "correct_hash",
            IsActive = true
        };

        _userRepoMock.Setup(r => r.GetByEmailAsync(user.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        _passwordHasherMock.Setup(h => h.VerifyPassword("WrongPassword", "correct_hash"))
            .Returns(false);

        var act = () => _sut.LoginAsync(new LoginRequestDto(user.Email, "WrongPassword"));

        await act.Should().ThrowAsync<UnauthorizedAccessException>()
            .WithMessage("Identifiants de connexion invalides.");
    }
}
