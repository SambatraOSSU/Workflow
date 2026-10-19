using FluentValidation;
using Vanguard.Application.DTOs.Requests;

namespace Vanguard.Application.Validators.Requests;

public class SubmitCatalogRequestValidator : AbstractValidator<SubmitCatalogRequestDto>
{
    public SubmitCatalogRequestValidator()
    {
        RuleFor(x => x.TemplateId)
            .NotEmpty().WithMessage("L'identifiant du template de catalogue est obligatoire.")
            .MaximumLength(100);

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Le titre de la requête est obligatoire.")
            .MaximumLength(200);

        RuleFor(x => x.Department)
            .NotEmpty().WithMessage("Le département demandeur est obligatoire.")
            .MaximumLength(100);

        RuleFor(x => x.EstimatedBudget)
            .GreaterThanOrEqualTo(0).WithMessage("Le budget estimé doit être positif ou nul.");
    }
}
