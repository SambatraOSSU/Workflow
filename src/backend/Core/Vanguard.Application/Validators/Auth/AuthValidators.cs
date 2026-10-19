using FluentValidation;
using Vanguard.Application.DTOs.Auth;

namespace Vanguard.Application.Validators.Auth;

public class LoginRequestDtoValidator : AbstractValidator<LoginRequestDto>
{
    public LoginRequestDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("L'email est obligatoire.")
            .EmailAddress().WithMessage("Format d'email invalide.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Le mot de passe est obligatoire.");
    }
}

public class RegisterTenantRequestDtoValidator : AbstractValidator<RegisterTenantRequestDto>
{
    public RegisterTenantRequestDtoValidator()
    {
        RuleFor(x => x.OrganizationName)
            .NotEmpty().WithMessage("Le nom de l'organisation est obligatoire.")
            .MaximumLength(200);

        RuleFor(x => x.OrganizationSlug)
            .NotEmpty().WithMessage("L'identifiant slug est obligatoire.")
            .Matches("^[a-z0-9-]+$").WithMessage("Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.")
            .MaximumLength(100);

        RuleFor(x => x.AdminEmail)
            .NotEmpty().WithMessage("L'email administrateur est obligatoire.")
            .EmailAddress().WithMessage("Format d'email invalide.");

        RuleFor(x => x.AdminPassword)
            .NotEmpty().WithMessage("Le mot de passe est obligatoire.")
            .MinimumLength(8).WithMessage("Le mot de passe doit comporter au moins 8 caractères.");

        RuleFor(x => x.AdminFullName)
            .NotEmpty().WithMessage("Le nom complet est obligatoire.")
            .MaximumLength(200);
    }
}
