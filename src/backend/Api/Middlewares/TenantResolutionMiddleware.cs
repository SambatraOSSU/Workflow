using System.Security.Claims;
using Vanguard.Application.Common.Interfaces;

namespace Vanguard.Api.Middlewares;

public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolutionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ICurrentTenantService currentTenantService)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var roleClaim = context.User.FindFirst(ClaimTypes.Role)?.Value 
                            ?? context.User.FindFirst("role")?.Value;
            var tenantIdClaim = context.User.FindFirst("tenant_id")?.Value;
            var tenantSlugClaim = context.User.FindFirst("tenant_slug")?.Value;

            if (Guid.TryParse(tenantIdClaim, out var tenantId))
            {
                currentTenantService.SetTenant(tenantId, tenantSlugClaim);
            }
            else if (!string.Equals(roleClaim, "SuperAdmin", StringComparison.OrdinalIgnoreCase))
            {
                // Utilisateur authentifié non SuperAdmin sans tenant_id valide: assigner un TenantId isolé
                currentTenantService.SetTenant(Guid.Empty, "unassigned");
            }
        }

        await _next(context);
    }
}
