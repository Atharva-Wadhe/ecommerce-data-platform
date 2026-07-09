using Microsoft.AspNetCore.Mvc;

namespace ShopSphere.Api.Models.Requests;

public class TopSellerRequest
{
    [FromQuery(Name = "fromDate")]
    public DateOnly? FromDate { get; set; }

    [FromQuery(Name = "toDate")]
    public DateOnly? ToDate { get; set; }

    [FromQuery(Name = "limit")]
    public int? Limit { get; set; }
}
