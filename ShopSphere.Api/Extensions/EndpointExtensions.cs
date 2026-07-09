using Microsoft.AspNetCore.Routing;
using ShopSphere.Api.Endpoints;

namespace ShopSphere.Api.Extensions;

public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapApiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapDashboardEndpoints();
        return app;
    }
}
