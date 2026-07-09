namespace ShopSphere.Api.Models.Responses;

public class CategorySalesResponse
{
    public string Category { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Orders { get; set; }
}
