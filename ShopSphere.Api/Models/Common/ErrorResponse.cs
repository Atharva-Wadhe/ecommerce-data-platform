namespace ShopSphere.Api.Models.Common;

public class ErrorResponse
{
    public string Message { get; set; } = string.Empty;
    public string? Detail { get; set; }
    public List<string>? Errors { get; set; }
}
