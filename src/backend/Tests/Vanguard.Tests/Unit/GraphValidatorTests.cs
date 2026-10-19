using FluentAssertions;
using Vanguard.Application.DTOs.Workflows;
using Vanguard.Application.Services;
using Xunit;

namespace Vanguard.Tests.Unit;

public class GraphValidatorTests
{
    private readonly GraphValidator _validator = new();

    [Fact]
    public void ValidateGraph_ValidStandardPipeline_ShouldReturnValid()
    {
        // Arrange
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("t1", "trigger", "webhook", "Webhook Trigger", "Ingest PO", new NodePositionDto(0, 0), null),
                new("gate1", "gate", "condition", "Check Amount", "Rule", new NodePositionDto(100, 0), new NodeConfigDto(ConditionExpression: "amount > 50000")),
                new("task1", "task", "approval", "VP Approval", "Signoff", new NodePositionDto(200, 0), new NodeConfigDto(Prompt: "Approve CapEx")),
                new("end1", "end", "slack", "Complete", "Notify", new NodePositionDto(300, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "t1", "gate1", null, null, null),
                new("e2", "gate1", "task1", "True", "amount > 50000", null),
                new("e3", "task1", "end1", null, null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.IsValid.Should().BeTrue();
        result.Errors.Should().BeEmpty();
        result.NodeCount.Should().Be(4);
        result.CycleCount.Should().Be(0);
        result.TopologySummary.Should().Contain("4 Nodes");
    }

    [Fact]
    public void ValidateGraph_MissingTrigger_ShouldReturnInvalidWithExplicitError()
    {
        // Arrange: No trigger node
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("task1", "task", "approval", "VP Approval", "Signoff", new NodePositionDto(200, 0), null),
                new("end1", "end", "slack", "Complete", "Notify", new NodePositionDto(300, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "task1", "end1", null, null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.Contains("Trigger"));
    }

    [Fact]
    public void ValidateGraph_InvalidEdgeEndpoint_ShouldReportError()
    {
        // Arrange: Edge pointing to non-existent node 'ghost-node'
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("t1", "trigger", "webhook", "Start", null, new NodePositionDto(0, 0), null),
                new("end1", "end", "slack", "Finish", null, new NodePositionDto(200, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "t1", "ghost-node", null, null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.Contains("ghost-node"));
    }

    [Fact]
    public void ValidateGraph_CycleDetected_ShouldReportCycleCount()
    {
        // Arrange: t1 -> n1 -> n2 -> n1 (loop) -> end1
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("t1", "trigger", "webhook", "Start", null, new NodePositionDto(0, 0), null),
                new("n1", "task", "approval", "Step 1", null, new NodePositionDto(100, 0), null),
                new("n2", "task", "approval", "Step 2", null, new NodePositionDto(200, 0), null),
                new("end1", "end", "slack", "Finish", null, new NodePositionDto(300, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "t1", "n1", null, null, null),
                new("e2", "n1", "n2", null, null, null),
                new("e3", "n2", "n1", "Loop", null, null),
                new("e4", "n2", "end1", "Exit", null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.CycleCount.Should().BeGreaterThan(0);
        result.Warnings.Should().Contain(w => w.Contains("Cycle") || w.Contains("Boucle"));
    }

    [Fact]
    public void ValidateGraph_OrphanNode_ShouldProduceWarning()
    {
        // Arrange: 'orphan-1' has no edges connecting to it
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("t1", "trigger", "webhook", "Start", null, new NodePositionDto(0, 0), null),
                new("orphan-1", "task", "approval", "Disconnected Node", null, new NodePositionDto(150, 100), null),
                new("end1", "end", "slack", "Finish", null, new NodePositionDto(300, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "t1", "end1", null, null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.Warnings.Should().Contain(w => w.Contains("orphelin") || w.Contains("Disconnected Node"));
    }
}
