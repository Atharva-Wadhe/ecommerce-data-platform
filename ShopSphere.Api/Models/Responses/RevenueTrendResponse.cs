namespace ShopSphere.Api.Models.Responses;

public class RevenueTrendResponse
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public int Orders { get; set; }
}
