using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Infrastructure.Persistence;
using Vanguard.Infrastructure.Persistence.Repositories;
using Vanguard.Infrastructure.Security;
using Vanguard.Infrastructure.Services;

namespace Vanguard.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Host=localhost;Port=5432;Database=vanguard_workflow;Username=postgres;Password=postgres";

        bool postgresAvailable = CanConnectToPostgres(connectionString);

        services.AddDbContext<VanguardDbContext>((serviceProvider, options) =>
        {
            if (postgresAvailable)
            {
                options.UseNpgsql(connectionString, npgsqlOptions =>
                {
                    npgsqlOptions.MigrationsAssembly(typeof(VanguardDbContext).Assembly.FullName);
                    npgsqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null);
                });
            }
            else
            {
                options.UseInMemoryDatabase("vanguard_workflow");
            }
        });

        services.AddScoped<ICurrentTenantService, CurrentTenantService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITenantRepository, TenantRepository>();
        services.AddScoped<IWorkflowRepository, WorkflowRepository>();
        services.AddScoped<IAuditRepository, AuditRepository>();
        services.AddScoped<IExecutionRepository, ExecutionRepository>();
        services.AddScoped<ITaskRepository, TaskRepository>();

        // Technical Security Services
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        return services;
    }

    private static bool CanConnectToPostgres(string connectionString)
    {
        try
        {
            var builder = new Npgsql.NpgsqlConnectionStringBuilder(connectionString);
            var host = builder.Host ?? "127.0.0.1";
            var port = builder.Port > 0 ? builder.Port : 5432;

            using var tcpClient = new System.Net.Sockets.TcpClient();
            var connectResult = tcpClient.BeginConnect(host, port, null, null);
            var success = connectResult.AsyncWaitHandle.WaitOne(TimeSpan.FromMilliseconds(400));
            if (!success) return false;
            tcpClient.EndConnect(connectResult);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
