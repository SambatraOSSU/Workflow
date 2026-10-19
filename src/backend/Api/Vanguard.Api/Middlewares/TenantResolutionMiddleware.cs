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
            var tenantIdClaim = context.User.FindFirst("tenant_id")?.Value;
            var tenantSlugClaim = context.User.FindFirst("tenant_slug")?.Value;

            if (Guid.TryParse(tenantIdClaim, out var tenantId))
            {
                currentTenantService.SetTenant(tenantId, tenantSlugClaim);
            }
        }

        await _next(context);
    }
}
