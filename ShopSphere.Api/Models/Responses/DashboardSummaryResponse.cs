namespace ShopSphere.Api.Models.Responses;

public class DashboardSummaryResponse
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int TotalCustomers { get; set; }
    public int TotalProducts { get; set; }
    public int TotalSellers { get; set; }
    public decimal AverageOrderValue { get; set; }
    public decimal AverageDeliveryDays { get; set; }
    public decimal AverageReviewScore { get; set; }
}
