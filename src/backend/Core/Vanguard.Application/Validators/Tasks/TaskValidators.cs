using FluentValidation;
using Vanguard.Application.DTOs.Tasks;

namespace Vanguard.Application.Validators.Tasks;

public class ApproveTaskRequestValidator : AbstractValidator<ApproveTaskRequestDto>
{
    public ApproveTaskRequestValidator()
    {
        RuleFor(x => x.DecisionNotes)
            .MaximumLength(2000).WithMessage("La justification d'approbation ne peut excéder 2000 caractères.");
    }
}

public class RejectTaskRequestValidator : AbstractValidator<RejectTaskRequestDto>
{
    public RejectTaskRequestValidator()
    {
        RuleFor(x => x.RejectionReason)
            .NotEmpty().WithMessage("Le motif de rejet est obligatoire pour la traçabilité de l'audit.")
            .MaximumLength(2000).WithMessage("Le motif de rejet ne peut excéder 2000 caractères.");
    }
}

public class DelegateTaskRequestValidator : AbstractValidator<DelegateTaskRequestDto>
{
    public DelegateTaskRequestValidator()
    {
        RuleFor(x => x.DelegateToUserEmail)
            .NotEmpty().WithMessage("L'adresse email du délégataire est obligatoire.")
            .EmailAddress().WithMessage("Format d'adresse email invalide.");
    }
}
