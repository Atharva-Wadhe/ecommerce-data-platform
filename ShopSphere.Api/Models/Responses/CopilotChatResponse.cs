namespace ShopSphere.Api.Models.Responses;

public class CopilotChatResponse
{
    public string Question { get; set; } = string.Empty;
    public string GeneratedSql { get; set; } = string.Empty;
    public CopilotDataResult? Data { get; set; }
    public CopilotInsightResult? Response { get; set; }
    public long ExecutionTimeMs { get; set; }
}

public class CopilotDataResult
{
    public List<string> Columns { get; set; } = new();
    public List<List<object>> Rows { get; set; } = new();
}

public class CopilotInsightResult
{
    public string Summary { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public string Confidence { get; set; } = "high";
}
