using System.Text.Json;
using FluentValidation;
using Vanguard.Application.DTOs.Executions;

namespace Vanguard.Application.Validators.Executions;

public class StartExecutionRequestValidator : AbstractValidator<StartExecutionRequestDto>
{
    public StartExecutionRequestValidator()
    {
        RuleFor(x => x.WorkflowDefinitionId)
            .NotEmpty().WithMessage("L'identifiant de la définition de workflow est obligatoire.");

        RuleFor(x => x.PayloadJson)
            .NotEmpty().WithMessage("Le payload de déclenchement est obligatoire.")
            .Must(BeValidJson).WithMessage("Le payload n'est pas un JSON valide.");
    }

    private static bool BeValidJson(string json)
    {
        if (string.IsNullOrWhiteSpace(json)) return false;
        try
        {
            using var doc = JsonDocument.Parse(json);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
