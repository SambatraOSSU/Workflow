using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Services;

namespace Vanguard.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped<IAuthService, AuthService>();
        services.AddSingleton<IGraphValidator, GraphValidator>();
        services.AddScoped<IWorkflowService, WorkflowService>();
        services.AddScoped<IWorkflowEngine, WorkflowEngine>();
        services.AddScoped<ITaskService, TaskService>();
        services.AddScoped<IMonitoringService, MonitoringService>();
        services.AddScoped<IRequestHubService, RequestHubService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<ISettingsService, SettingsService>();

        return services;
    }
}
