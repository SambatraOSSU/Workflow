using Moq;
using Vanguard.Application.DTOs.Requests;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Application.Services;
using Vanguard.Application.Validators.Requests;
using Vanguard.Domain.Entities.Engine;
using Xunit;

namespace Vanguard.Tests.Unit;

public class MonitoringAndRequestsTests
{
    private readonly Mock<IExecutionRepository> _executionRepoMock = new();

    [Fact]
    public async Task MonitoringService_ReturnsAccurateClusterMetrics()
    {
        // Arrange
        _executionRepoMock
            .Setup(r => r.GetAllAsync(ExecutionStatus.Running, null, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ExecutionInstance>
            {
                new() { Id = Guid.NewGuid(), Status = ExecutionStatus.Running },
                new() { Id = Guid.NewGuid(), Status = ExecutionStatus.Running }
            });

        var service = new MonitoringService(_executionRepoMock.Object);

        // Act
        var metrics = await service.GetClusterMetricsAsync();

        // Assert
        Assert.NotNull(metrics);
        Assert.Equal(1286, metrics.ActiveExecutionsCount);
        Assert.Equal(242.0, metrics.P99LatencyMs);
        Assert.Equal(1420.0, metrics.ThroughputStepsPerSec);
        Assert.True(metrics.UptimePercent >= 99.99);
    }

    [Fact]
    public async Task MonitoringService_ReturnsPipelineStagesAndWorkerPools()
    {
        // Arrange
        var service = new MonitoringService(_executionRepoMock.Object);

        // Act
        var stages = await service.GetStageLatenciesAsync();
        var pools = await service.GetWorkerPoolsAsync();

        // Assert
        Assert.Equal(5, stages.Count);
        Assert.Contains(stages, s => s.StageName == "Worker Execution");
        Assert.Equal(3, pools.Count);
        Assert.Contains(pools, p => p.PoolName == "US-East-Primary");
    }

    [Fact]
    public async Task RequestHubService_ReturnsTemplatesAndFilteredRequests()
    {
        // Arrange
        var service = new RequestHubService(_executionRepoMock.Object);

        // Act
        var templates = await service.GetCatalogTemplatesAsync();
        var allRequests = await service.GetRequestsAsync(null, null, null);
        var inReviewRequests = await service.GetRequestsAsync("InReview", null, null);

        // Assert
        Assert.Equal(4, templates.Count);
        Assert.NotEmpty(allRequests);
        Assert.All(inReviewRequests, r => Assert.Equal("In Review", r.Status));
    }

    [Fact]
    public async Task RequestHubService_SubmitsNewRequest_AndAllowsExpediteAndReject()
    {
        // Arrange
        var service = new RequestHubService(_executionRepoMock.Object);
        var submitDto = new SubmitCatalogRequestDto(
            TemplateId: "cloud-alloc",
            Title: "Custom ML Cluster for NLP",
            Department: "AI Research",
            EstimatedBudget: 15000m,
            Parameters: new Dictionary<string, string>
            {
                { "GPU Count", "4" },
                { "Memory", "64GB" }
            }
        );

        // Act - Submit
        var submitted = await service.SubmitRequestAsync(submitDto, Guid.NewGuid());

        // Assert - Submit
        Assert.NotNull(submitted);
        Assert.StartsWith("#REQ-", submitted.RequestNumber);
        Assert.Equal("Custom ML Cluster for NLP", submitted.Title);
        Assert.Equal(15000m, submitted.EstimatedBudget);

        // Act - Detail
        var detail = await service.GetRequestByIdAsync(submitted.Id);
        Assert.NotNull(detail);
        Assert.Equal(5, detail.Timeline.Count);

        // Act - Expedite
        var expedited = await service.ExpediteSlaAsync(submitted.Id);
        Assert.True(expedited);

        var expeditedDetail = await service.GetRequestByIdAsync(submitted.Id);
        Assert.Contains("Expedited", expeditedDetail!.RemainingTimeFormatted);

        // Act - Reject
        var rejected = await service.RejectRequestAsync(submitted.Id, "Budget cap reached for Q3");
        Assert.True(rejected);

        var rejectedDetail = await service.GetRequestByIdAsync(submitted.Id);
        Assert.Equal("Rejected", rejectedDetail!.Status);
        Assert.Contains("Budget cap reached", rejectedDetail.CurrentStage);
    }

    [Fact]
    public async Task SubmitCatalogRequestValidator_ValidatesCorrectly()
    {
        // Arrange
        var validator = new SubmitCatalogRequestValidator();

        var invalidDto = new SubmitCatalogRequestDto("", "", "", -100m, new());
        var validDto = new SubmitCatalogRequestDto("cloud-alloc", "Test Cluster", "IT", 500m, new());

        // Act
        var invalidResult = await validator.ValidateAsync(invalidDto);
        var validResult = await validator.ValidateAsync(validDto);

        // Assert
        Assert.False(invalidResult.IsValid);
        Assert.True(validResult.IsValid);
    }
}
