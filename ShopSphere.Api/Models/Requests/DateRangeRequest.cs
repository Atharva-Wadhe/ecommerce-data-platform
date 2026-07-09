using Microsoft.AspNetCore.Mvc;

namespace ShopSphere.Api.Models.Requests;

public class DateRangeRequest
{
    [FromQuery(Name = "fromDate")]
    public DateOnly? FromDate { get; set; }

    [FromQuery(Name = "toDate")]
    public DateOnly? ToDate { get; set; }
}
