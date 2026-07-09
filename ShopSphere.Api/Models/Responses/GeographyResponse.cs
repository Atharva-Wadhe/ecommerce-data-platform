namespace ShopSphere.Api.Models.Responses;

public class GeographyResponse
{
    public string State { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int Orders { get; set; }
    public int Customers { get; set; }
}
