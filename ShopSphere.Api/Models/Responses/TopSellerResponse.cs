namespace ShopSphere.Api.Models.Responses;

public class TopSellerResponse
{
    public string Seller { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Orders { get; set; }
    public decimal AverageRating { get; set; }
}
