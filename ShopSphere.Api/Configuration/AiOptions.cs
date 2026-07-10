namespace ShopSphere.Api.Configuration;

public class AiOptions
{
    public const string SectionName = "AiSettings";

    public string ApiKey { get; set; } = string.Empty;
    public string Endpoint { get; set; } = "https://integrate.api.nvidia.com/v1/chat/completions";
    public string Model { get; set; } = "minimaxai/minimax-m3";
}
