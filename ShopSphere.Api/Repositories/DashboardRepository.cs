using Dapper;
using Npgsql;
using ShopSphere.Api.Database;
using ShopSphere.Api.Models.Responses;

namespace ShopSphere.Api.Repositories;

public class DashboardRepository
{
    private readonly DbConnectionFactory _dbFactory;

    public DashboardRepository(DbConnectionFactory dbFactory)
    {
        _dbFactory = dbFactory;
    }

    public async Task<DashboardSummaryResponse?> GetDashboardSummaryAsync(DateTime from, DateTime to)
    {
        using var conn = _dbFactory.CreateConnection();
        await conn.OpenAsync();

        var sql = @"
            SELECT 
                total_revenue AS TotalRevenue,
                total_orders AS TotalOrders,
                total_customers AS TotalCustomers,
                total_products AS TotalProducts,
                total_sellers AS TotalSellers,
                average_order_value AS AverageOrderValue,
                average_delivery_days AS AverageDeliveryDays,
                average_review_score AS AverageReviewScore
            FROM analytics.fn_dashboard_summary(@FromDate::date, @ToDate::date);";

        return await conn.QueryFirstOrDefaultAsync<DashboardSummaryResponse>(sql, new { FromDate = from, ToDate = to });
    }

    public async Task<IEnumerable<RevenueTrendResponse>> GetRevenueTrendAsync(DateTime from, DateTime to)
    {
        using var conn = _dbFactory.CreateConnection();
        await conn.OpenAsync();

        var sql = @"
            SELECT 
                sales_date AS Date,
                revenue AS Revenue,
                orders AS Orders
            FROM analytics.fn_revenue_trend(@FromDate::date, @ToDate::date);";

        return await conn.QueryAsync<RevenueTrendResponse>(sql, new { FromDate = from, ToDate = to });
    }

    public async Task<IEnumerable<OrderStatusResponse>> GetOrderStatusDistributionAsync(DateTime from, DateTime to)
    {
        using var conn = _dbFactory.CreateConnection();
        await conn.OpenAsync();

        var sql = @"
            SELECT 
                order_status AS Status,
                orders AS Orders
            FROM analytics.fn_order_status_distribution(@FromDate::date, @ToDate::date);";

        return await conn.QueryAsync<OrderStatusResponse>(sql, new { FromDate = from, ToDate = to });
    }

    public async Task<IEnumerable<CategorySalesResponse>> GetCategorySalesAsync(DateTime from, DateTime to)
    {
        using var conn = _dbFactory.CreateConnection();
        await conn.OpenAsync();

        var sql = @"
            SELECT 
                category AS Category,
                revenue AS Revenue,
                orders AS Orders
            FROM analytics.fn_category_sales(@FromDate::date, @ToDate::date);";

        return await conn.QueryAsync<CategorySalesResponse>(sql, new { FromDate = from, ToDate = to });
    }

    public async Task<IEnumerable<TopSellerResponse>> GetTopSellersAsync(DateTime from, DateTime to, int limit = 10)
    {
        using var conn = _dbFactory.CreateConnection();
        await conn.OpenAsync();

        var sql = @"
            SELECT 
                seller_id AS Seller,
                revenue AS Revenue,
                total_orders AS Orders,
                average_rating AS AverageRating
            FROM analytics.fn_top_sellers(@FromDate::date, @ToDate::date, @Limit);";

        return await conn.QueryAsync<TopSellerResponse>(sql, new { FromDate = from, ToDate = to, Limit = limit });
    }

    public async Task<IEnumerable<GeographyResponse>> GetGeographySalesAsync(DateTime from, DateTime to)
    {
        using var conn = _dbFactory.CreateConnection();
        await conn.OpenAsync();

        var sql = @"
            SELECT 
                state AS State,
                revenue AS Revenue,
                orders AS Orders,
                customers AS Customers
            FROM analytics.fn_geography_sales(@FromDate::date, @ToDate::date);";

        return await conn.QueryAsync<GeographyResponse>(sql, new { FromDate = from, ToDate = to });
    }

    public async Task<DeliveryMetricsResponse?> GetDeliveryMetricsAsync(DateTime from, DateTime to)
    {
        using var conn = _dbFactory.CreateConnection();
        await conn.OpenAsync();

        var sql = @"
            SELECT 
                average_delivery_days AS AverageDelivery,
                minimum_delivery_days AS MinimumDelivery,
                maximum_delivery_days AS MaximumDelivery
            FROM analytics.fn_delivery_metrics(@FromDate::date, @ToDate::date);";

        return await conn.QueryFirstOrDefaultAsync<DeliveryMetricsResponse>(sql, new { FromDate = from, ToDate = to });
    }

    public async Task<ReviewMetricsResponse?> GetReviewMetricsAsync(DateTime from, DateTime to)
    {
        using var conn = _dbFactory.CreateConnection();
        await conn.OpenAsync();

        var sql = @"
            SELECT 
                average_rating AS AverageRating,
                one_star AS Stars1,
                two_star AS Stars2,
                three_star AS Stars3,
                four_star AS Stars4,
                five_star AS Stars5
            FROM analytics.fn_review_metrics(@FromDate::date, @ToDate::date);";

        return await conn.QueryFirstOrDefaultAsync<ReviewMetricsResponse>(sql, new { FromDate = from, ToDate = to });
    }
}
