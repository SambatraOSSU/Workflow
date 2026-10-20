using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Vanguard.Api.Middlewares;
using Vanguard.Application;
using Vanguard.Application.Interfaces;
using Vanguard.Infrastructure;
using Vanguard.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// 1. Couches Applicatives & Infrastructure (Modular Monolith)
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// 2. Contrôleurs & Sérialisation JSON
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// 3. Authentification JWT
var secretKey = builder.Configuration["Jwt:SecretKey"] ?? "Vanguard_Enterprise_Workflow_Engine_Super_Secret_Key_2026!#$__LongEnoughForHmacSha256";
var issuer = builder.Configuration["Jwt:Issuer"] ?? "VanguardWorkflowEngine";
var audience = builder.Configuration["Jwt:Audience"] ?? "VanguardClients";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 4. CORS pour le client Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 5. Documentation OpenAPI / Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Vanguard Workflow Engine API",
        Version = "v1",
        Description = "Enterprise SaaS Workflow & Orchestration Engine — Modular Monolith .NET 8"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header avec format 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 6. Pipeline HTTP & Middlewares
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Vanguard API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseCors("AllowAngularClient");

app.UseAuthentication();
app.UseMiddleware<TenantResolutionMiddleware>();
app.UseAuthorization();

app.MapControllers();

// 7. Initialisation de la Base de Données au démarrage
using (var scope = app.Services.CreateScope())
{
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<VanguardDbContext>();
        var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher>();

        // Tente de créer la base si Postgres est disponible
        await dbContext.Database.EnsureCreatedAsync();
        await DbInitializer.SeedAsync(dbContext, passwordHasher);
        logger.LogInformation("Base de données initialisée et amorcée avec succès.");
    }
    catch (Exception ex)
    {
        logger.LogWarning("PostgreSQL local non joignable lors de l'initialisation automatique : {Message}. Les migrations manuelles peuvent être appliquées dès le démarrage du conteneur/service.", ex.Message);
    }
}

app.Run();
