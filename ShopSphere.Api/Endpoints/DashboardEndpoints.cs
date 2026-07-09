using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using ShopSphere.Api.Models.Common;
using ShopSphere.Api.Models.Requests;
using ShopSphere.Api.Services;

namespace ShopSphere.Api.Endpoints;

public static class DashboardEndpoints
{
    public static IEndpointRouteBuilder MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard")
                       .WithTags("Dashboard");

        group.MapGet("/summary", async ([AsParameters] DateRangeRequest request, DashboardService service) =>
        {
            if (request.FromDate.HasValue && request.ToDate.HasValue && request.FromDate > request.ToDate)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = "Validation failed",
                    Errors = new List<string> { "FromDate cannot be after ToDate." }
                });
            }

            var (from, to) = GetDateRange(request);
            var result = await service.GetDashboardSummaryAsync(from, to);
            return Results.Ok(result);
        });

        group.MapGet("/revenue-trend", async ([AsParameters] DateRangeRequest request, DashboardService service) =>
        {
            if (request.FromDate.HasValue && request.ToDate.HasValue && request.FromDate > request.ToDate)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = "Validation failed",
                    Errors = new List<string> { "FromDate cannot be after ToDate." }
                });
            }

            var (from, to) = GetDateRange(request);
            var result = await service.GetRevenueTrendAsync(from, to);
            return Results.Ok(result);
        });

        group.MapGet("/order-status", async ([AsParameters] DateRangeRequest request, DashboardService service) =>
        {
            if (request.FromDate.HasValue && request.ToDate.HasValue && request.FromDate > request.ToDate)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = "Validation failed",
                    Errors = new List<string> { "FromDate cannot be after ToDate." }
                });
            }

            var (from, to) = GetDateRange(request);
            var result = await service.GetOrderStatusDistributionAsync(from, to);
            return Results.Ok(result);
        });

        group.MapGet("/category-sales", async ([AsParameters] DateRangeRequest request, DashboardService service) =>
        {
            if (request.FromDate.HasValue && request.ToDate.HasValue && request.FromDate > request.ToDate)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = "Validation failed",
                    Errors = new List<string> { "FromDate cannot be after ToDate." }
                });
            }

            var (from, to) = GetDateRange(request);
            var result = await service.GetCategorySalesAsync(from, to);
            return Results.Ok(result);
        });

        group.MapGet("/top-sellers", async ([AsParameters] TopSellerRequest request, DashboardService service) =>
        {
            if (request.FromDate.HasValue && request.ToDate.HasValue && request.FromDate > request.ToDate)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = "Validation failed",
                    Errors = new List<string> { "FromDate cannot be after ToDate." }
                });
            }

            var from = request.FromDate?.ToDateTime(TimeOnly.MinValue) ?? DateTime.UtcNow.Date;
            var to = request.ToDate?.ToDateTime(TimeOnly.MinValue) ?? DateTime.UtcNow.Date;
            var limit = request.Limit ?? 10;

            var result = await service.GetTopSellersAsync(from, to, limit);
            return Results.Ok(result);
        });

        group.MapGet("/geography", async ([AsParameters] DateRangeRequest request, DashboardService service) =>
        {
            if (request.FromDate.HasValue && request.ToDate.HasValue && request.FromDate > request.ToDate)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = "Validation failed",
                    Errors = new List<string> { "FromDate cannot be after ToDate." }
                });
            }

            var (from, to) = GetDateRange(request);
            var result = await service.GetGeographySalesAsync(from, to);
            return Results.Ok(result);
        });

        group.MapGet("/delivery", async ([AsParameters] DateRangeRequest request, DashboardService service) =>
        {
            if (request.FromDate.HasValue && request.ToDate.HasValue && request.FromDate > request.ToDate)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = "Validation failed",
                    Errors = new List<string> { "FromDate cannot be after ToDate." }
                });
            }

            var (from, to) = GetDateRange(request);
            var result = await service.GetDeliveryMetricsAsync(from, to);
            return Results.Ok(result);
        });

        group.MapGet("/reviews", async ([AsParameters] DateRangeRequest request, DashboardService service) =>
        {
            if (request.FromDate.HasValue && request.ToDate.HasValue && request.FromDate > request.ToDate)
            {
                return Results.BadRequest(new ErrorResponse
                {
                    Message = "Validation failed",
                    Errors = new List<string> { "FromDate cannot be after ToDate." }
                });
            }

            var (from, to) = GetDateRange(request);
            var result = await service.GetReviewMetricsAsync(from, to);
            return Results.Ok(result);
        });

        return app;
    }

    private static (DateTime From, DateTime To) GetDateRange(DateRangeRequest request)
    {
        var from = request.FromDate?.ToDateTime(TimeOnly.MinValue) ?? DateTime.UtcNow.Date;
        var to = request.ToDate?.ToDateTime(TimeOnly.MinValue) ?? DateTime.UtcNow.Date;
        return (from, to);
    }
}
