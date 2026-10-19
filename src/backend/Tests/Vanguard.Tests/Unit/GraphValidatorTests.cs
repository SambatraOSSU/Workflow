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

    [Fact]
    public void ValidateGraph_DirectSelfLoop_ShouldDetectCycle()
    {
        // Arrange: Node n1 connects to itself (n1 -> n1)
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("t1", "trigger", "webhook", "Start", null, new NodePositionDto(0, 0), null),
                new("n1", "task", "approval", "Self Loop Node", null, new NodePositionDto(100, 0), null),
                new("end1", "end", "slack", "Finish", null, new NodePositionDto(200, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "t1", "n1", null, null, null),
                new("e2", "n1", "n1", "Self Loop", null, null),
                new("e3", "n1", "end1", "Exit", null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.CycleCount.Should().BeGreaterThan(0);
        result.Warnings.Should().Contain(w => w.Contains("Cycle") || w.Contains("Boucle"));
    }

    [Fact]
    public void ValidateGraph_MultipleClosedCycles_ShouldCountAllCycles()
    {
        // Arrange: Two distinct closed loops: Loop 1 (n1 <-> n2), Loop 2 (n3 <-> n4)
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("t1", "trigger", "webhook", "Start", null, new NodePositionDto(0, 0), null),
                new("n1", "task", "approval", "Step 1", null, new NodePositionDto(100, 0), null),
                new("n2", "task", "approval", "Step 2", null, new NodePositionDto(150, 0), null),
                new("n3", "task", "approval", "Step 3", null, new NodePositionDto(200, 0), null),
                new("n4", "task", "approval", "Step 4", null, new NodePositionDto(250, 0), null),
                new("end1", "end", "slack", "Finish", null, new NodePositionDto(300, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "t1", "n1", null, null, null),
                new("e2", "n1", "n2", null, null, null),
                new("e3", "n2", "n1", "Cycle1", null, null),
                new("e4", "n2", "n3", null, null, null),
                new("e5", "n3", "n4", null, null, null),
                new("e6", "n4", "n3", "Cycle2", null, null),
                new("e7", "n4", "end1", null, null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.CycleCount.Should().BeGreaterThanOrEqualTo(2);
        result.Warnings.Should().Contain(w => w.Contains("Cycle") || w.Contains("Boucle"));
    }

    [Fact]
    public void ValidateGraph_DeadEndNonTerminalNode_ShouldProduceWarning()
    {
        // Arrange: task 'dead-end-node' has incoming connection but no outgoing, and is not an 'end' node
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("t1", "trigger", "webhook", "Start", null, new NodePositionDto(0, 0), null),
                new("dead-end-node", "task", "approval", "Cul-de-sac", null, new NodePositionDto(100, 0), null),
                new("end1", "end", "slack", "Finish", null, new NodePositionDto(200, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "t1", "dead-end-node", null, null, null),
                new("e2", "t1", "end1", null, null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.Warnings.Should().Contain(w => w.Contains("sans issue") || w.Contains("Cul-de-sac"));
    }

    [Fact]
    public void ValidateGraph_DuplicateNodeIds_ThrowsArgumentExceptionDueToDictionaryCollision()
    {
        // Arrange: Two nodes sharing the identical ID "node-dup"
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("node-dup", "trigger", "webhook", "Start A", null, new NodePositionDto(0, 0), null),
                new("node-dup", "task", "approval", "Start B", null, new NodePositionDto(100, 0), null),
                new("end1", "end", "slack", "Finish", null, new NodePositionDto(200, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "node-dup", "end1", null, null, null)
            }
        );

        // Act & Assert
        // QA Finding: GraphValidator detects duplicate IDs in errors list, but unhandled ArgumentException
        // occurs when building inDegree dictionary before returning the validation result.
        var act = () => _validator.ValidateGraph(graph);
        act.Should().Throw<ArgumentException>().WithMessage("*node-dup*");
    }

    [Fact]
    public void ValidateGraph_MissingEndNode_ShouldProduceExplicitWarning()
    {
        // Arrange: Graph without any 'end' type node
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("t1", "trigger", "webhook", "Start", null, new NodePositionDto(0, 0), null),
                new("task1", "task", "approval", "Process", null, new NodePositionDto(100, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "t1", "task1", null, null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.Warnings.Should().Contain(w => w.Contains("aucun nœud de fin"));
    }

    [Fact]
    public void ValidateGraph_GateNodeWithoutConditionExpression_ShouldProduceWarning()
    {
        // Arrange: 'gate' node with empty/null ConditionExpression
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("t1", "trigger", "webhook", "Start", null, new NodePositionDto(0, 0), null),
                new("gate-empty", "gate", "condition", "Unconfigured Gateway", null, new NodePositionDto(100, 0), new NodeConfigDto(ConditionExpression: "")),
                new("end1", "end", "slack", "Finish", null, new NodePositionDto(200, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "t1", "gate-empty", null, null, null),
                new("e2", "gate-empty", "end1", null, null, null)
            }
        );

        // Act
        var result = _validator.ValidateGraph(graph);

        // Assert
        result.Warnings.Should().Contain(w => w.Contains("pas d'expression configurée") || w.Contains("Unconfigured Gateway"));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void ValidateGraph_EmptyOrWhitespaceJson_ShouldReturnInvalid(string? invalidJson)
    {
        // Act
        var result = _validator.ValidateGraph(invalidJson!);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.Contains("vide"));
    }

    [Fact]
    public void ValidateGraph_MalformedJsonSyntax_ShouldReturnInvalidWithSyntaxError()
    {
        // Arrange
        var corruptedJson = "{\"nodes\": [ { \"id\": \"t1\", \"type\": \"trigger\" } "; // Missing closing braces

        // Act
        var result = _validator.ValidateGraph(corruptedJson);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.Contains("Syntaxe JSON invalide"));
    }

    [Fact]
    public void ValidateGraph_EmptyNodesList_ShouldReturnInvalid()
    {
        // Arrange
        var emptyGraphJson = "{\"nodes\":[],\"edges\":[]}";

        // Act
        var result = _validator.ValidateGraph(emptyGraphJson);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.Contains("aucun nœud"));
    }
}
