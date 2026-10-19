using Vanguard.Application.DTOs.Workflows;

namespace Vanguard.Application.Interfaces;

public interface IGraphValidator
{
    GraphValidationResultDto ValidateGraph(string graphDefinitionJson);
    GraphValidationResultDto ValidateGraph(WorkflowGraphDto graph);
}
