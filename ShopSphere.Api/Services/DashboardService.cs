using ShopSphere.Api.Models.Responses;
using ShopSphere.Api.Repositories;

namespace ShopSphere.Api.Services;

public class DashboardService
{
    private readonly DashboardRepository _repo;

    public DashboardService(DashboardRepository repo)
    {
        _repo = repo;
    }

    public async Task<DashboardSummaryResponse?> GetDashboardSummaryAsync(DateTime from, DateTime to)
    {
        return await _repo.GetDashboardSummaryAsync(from, to);
    }

    public async Task<IEnumerable<RevenueTrendResponse>> GetRevenueTrendAsync(DateTime from, DateTime to)
    {
        return await _repo.GetRevenueTrendAsync(from, to);
    }

    public async Task<IEnumerable<OrderStatusResponse>> GetOrderStatusDistributionAsync(DateTime from, DateTime to)
    {
        return await _repo.GetOrderStatusDistributionAsync(from, to);
    }

    public async Task<IEnumerable<CategorySalesResponse>> GetCategorySalesAsync(DateTime from, DateTime to)
    {
        return await _repo.GetCategorySalesAsync(from, to);
    }

    public async Task<IEnumerable<TopSellerResponse>> GetTopSellersAsync(DateTime from, DateTime to, int limit = 10)
    {
        return await _repo.GetTopSellersAsync(from, to, limit);
    }

    public async Task<IEnumerable<GeographyResponse>> GetGeographySalesAsync(DateTime from, DateTime to)
    {
        return await _repo.GetGeographySalesAsync(from, to);
    }

    public async Task<DeliveryMetricsResponse?> GetDeliveryMetricsAsync(DateTime from, DateTime to)
    {
        return await _repo.GetDeliveryMetricsAsync(from, to);
    }

    public async Task<ReviewMetricsResponse?> GetReviewMetricsAsync(DateTime from, DateTime to)
    {
        return await _repo.GetReviewMetricsAsync(from, to);
    }
}
