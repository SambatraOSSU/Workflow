using FluentAssertions;
using Vanguard.Application.DTOs.Auth;
using Vanguard.Application.Validators.Auth;
using Xunit;

namespace Vanguard.Tests.Unit;

public class AuthValidatorsTests
{
    private readonly LoginRequestDtoValidator _loginValidator = new();
    private readonly RegisterTenantRequestDtoValidator _registerValidator = new();

    [Theory]
    [InlineData("", "Password123!")]
    [InlineData("invalid-email", "Password123!")]
    [InlineData("valid@vanguard.io", "")]
    public async Task LoginValidator_Should_Fail_When_Inputs_Are_Invalid(string email, string password)
    {
        var request = new LoginRequestDto(email, password);
        var result = await _loginValidator.ValidateAsync(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().NotBeEmpty();
    }

    [Fact]
    public async Task LoginValidator_Should_Pass_When_Inputs_Are_Valid()
    {
        var request = new LoginRequestDto("alexander.vance@vanguard.io", "SecurePassword123!");
        var result = await _loginValidator.ValidateAsync(request);

        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("", "slug", "admin@vanguard.io", "Password123!", "Admin Name")]
    [InlineData("Vanguard HQ", "INVALID SLUG WITH SPACES", "admin@vanguard.io", "Password123!", "Admin Name")]
    [InlineData("Vanguard HQ", "vanguard-hq", "not-an-email", "Password123!", "Admin Name")]
    [InlineData("Vanguard HQ", "vanguard-hq", "admin@vanguard.io", "short", "Admin Name")]
    public async Task RegisterValidator_Should_Fail_When_Data_Is_Invalid(
        string orgName, string slug, string email, string password, string fullName)
    {
        var request = new RegisterTenantRequestDto(orgName, slug, email, password, fullName);
        var result = await _registerValidator.ValidateAsync(request);

        result.IsValid.Should().BeFalse();
    }
}
