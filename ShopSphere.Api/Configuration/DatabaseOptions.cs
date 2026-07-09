namespace ShopSphere.Api.Configuration;

public class DatabaseOptions
{
    public const string SectionName = "ConnectionStrings";

    public string AnalyticsDb { get; set; } = string.Empty;
}
