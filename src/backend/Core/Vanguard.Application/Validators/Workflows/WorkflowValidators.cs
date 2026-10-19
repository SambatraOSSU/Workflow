using FluentValidation;
using System.Text.Json;
using Vanguard.Application.DTOs.Workflows;

namespace Vanguard.Application.Validators.Workflows;

public class CreateWorkflowRequestValidator : AbstractValidator<CreateWorkflowRequestDto>
{
    public CreateWorkflowRequestValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty().WithMessage("La clé d'identification du workflow est obligatoire.")
            .MaximumLength(150).WithMessage("La clé ne peut excéder 150 caractères.")
            .Matches("^[a-z0-9-]+$").WithMessage("La clé doit contenir uniquement des lettres minuscules, chiffres et tirets.");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Le titre du workflow est obligatoire.")
            .MaximumLength(300).WithMessage("Le titre ne peut excéder 300 caractères.");

        RuleFor(x => x.Department)
            .NotEmpty().WithMessage("Le département est obligatoire.")
            .MaximumLength(150).WithMessage("Le département ne peut excéder 150 caractères.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("La catégorie est obligatoire.")
            .MaximumLength(100).WithMessage("La catégorie ne peut excéder 100 caractères.");
    }
}

public class UpdateWorkflowRequestValidator : AbstractValidator<UpdateWorkflowRequestDto>
{
    public UpdateWorkflowRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Le titre du workflow est obligatoire.")
            .MaximumLength(300).WithMessage("Le titre ne peut excéder 300 caractères.");

        RuleFor(x => x.Department)
            .NotEmpty().WithMessage("Le département est obligatoire.")
            .MaximumLength(150).WithMessage("Le département ne peut excéder 150 caractères.");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("La catégorie est obligatoire.")
            .MaximumLength(100).WithMessage("La catégorie ne peut excéder 100 caractères.");
    }
}

public class SaveWorkflowGraphRequestValidator : AbstractValidator<SaveWorkflowGraphRequestDto>
{
    public SaveWorkflowGraphRequestValidator()
    {
        RuleFor(x => x.GraphDefinitionJson)
            .NotEmpty().WithMessage("La définition du graphe JSON est obligatoire.")
            .Must(BeValidJson).WithMessage("Le graphe fourni n'est pas un JSON valide.");
    }

    private static bool BeValidJson(string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return false;
        try
        {
            using var doc = JsonDocument.Parse(json);
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
    }
}

public class PublishWorkflowRequestValidator : AbstractValidator<PublishWorkflowRequestDto>
{
    public PublishWorkflowRequestValidator()
    {
        RuleFor(x => x.ChangeNotes)
            .MaximumLength(1000).WithMessage("Les notes de version ne peuvent excéder 1000 caractères.");
    }
}

public class PublishWorkflowVersionRequestValidator : AbstractValidator<PublishWorkflowVersionRequestDto>
{
    public PublishWorkflowVersionRequestValidator()
    {
        RuleFor(x => x.ChangeNotes)
            .MaximumLength(1000).WithMessage("Les notes de version ne peuvent excéder 1000 caractères.");
    }
}
