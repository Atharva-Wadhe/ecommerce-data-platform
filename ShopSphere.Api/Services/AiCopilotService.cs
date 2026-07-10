using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Options;
using ShopSphere.Api.Configuration;
using ShopSphere.Api.Database;
using ShopSphere.Api.Models.Responses;

namespace ShopSphere.Api.Services;

public class AiCopilotService
{
    private readonly DbConnectionFactory _dbFactory;
    private readonly AiOptions _options;
    private readonly HttpClient _httpClient;

    public AiCopilotService(DbConnectionFactory dbFactory, IOptions<AiOptions> options, HttpClient httpClient)
    {
        _dbFactory = dbFactory;
        _options = options.Value;
        _httpClient = httpClient;
    }

    public async Task<CopilotChatResponse> ProcessQuestionAsync(string question)
    {
        var stopwatch = Stopwatch.StartNew();

        // 1. Generate SQL
        var generatedSql = await GenerateSqlAsync(question);
        
        // Clean SQL (remove markdown code fences if any)
        generatedSql = CleanSql(generatedSql);

        // 2. Validate SQL
        ValidateSql(generatedSql);

        // 3. Execute SQL
        var dataResult = await ExecuteSqlAsync(generatedSql);

        // 4. Generate Insights
        var insightResult = await GenerateInsightsAsync(question, generatedSql, dataResult);

        stopwatch.Stop();

        return new CopilotChatResponse
        {
            Question = question,
            GeneratedSql = generatedSql,
            Data = dataResult,
            Response = insightResult,
            ExecutionTimeMs = stopwatch.ElapsedMilliseconds
        };
    }

    private async Task<string> GenerateSqlAsync(string question)
    {
        var systemPrompt = @"You are ShopSphere Analytics AI.
You help business users explore e-commerce data.
You answer questions only by generating PostgreSQL SELECT queries over the analytical warehouse.

Allowed Data Source:
Only use: analytics.vw_dashboard_summary
Never reference: warehouse.*, metadata.*, information_schema.*, pg_catalog.*

Available Columns:
- full_date (date)
- year (integer)
- quarter (integer)
- month (integer)
- month_name (text)
- week (integer)
- day (integer)
- order_id (text)
- order_item_id (integer)
- order_status (text)
- customer_id (text)
- customer_city (text)
- customer_state (text)
- seller_id (text)
- seller_city (text)
- seller_state (text)
- product_id (text)
- product_category_name (text)
- price (double precision)
- freight_value (double precision)
- item_total (double precision)
- total_payment_value (double precision)
- average_review_score (double precision)
- review_count (bigint)
- delivery_days (integer)

Business Definitions:
- Revenue = SUM(item_total)
- Order Count = COUNT(DISTINCT order_id)
- Customer Count = COUNT(DISTINCT customer_id)
- Seller Count = COUNT(DISTINCT seller_id)
- Average Rating = AVG(average_review_score)
- Average Delivery = AVG(delivery_days)

SQL Rules:
- Allowed: SELECT, WHERE, GROUP BY, ORDER BY, HAVING, LIMIT, COUNT, SUM, AVG, MIN, MAX, CASE, CTE
- Forbidden: INSERT, UPDATE, DELETE, MERGE, TRUNCATE, DROP, ALTER, CREATE, CALL, EXECUTE, COPY

Output Format:
Return ONLY the raw SQL query. Do not include any explanation, markdown formatting, or code fences (like ```sql).";

        var requestBody = new
        {
            model = _options.Model,
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = question }
            },
            temperature = 0.1,
            top_p = 1,
            max_tokens = 2048,
            stream = false
        };

        var response = await CallLlmAsync(requestBody);
        return response.Trim();
    }

    private async Task<CopilotInsightResult> GenerateInsightsAsync(string question, string sql, CopilotDataResult data)
    {
        var systemPrompt = @"You are an analytics consultant.
Never invent values. Only use the supplied SQL results.
Keep responses concise. Mention interesting business observations when obvious.
You MUST return a JSON object with the following structure:
{
  ""summary"": ""A brief one-sentence summary of the answer."",
  ""answer"": ""A detailed but concise explanation of the results."",
  ""confidence"": ""high""
}
Do not include any other text, markdown formatting, or code fences.";

        var dataJson = JsonSerializer.Serialize(data);
        var userContent = $"Question: {question}\nSQL: {sql}\nData: {dataJson}";

        var requestBody = new
        {
            model = _options.Model,
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userContent }
            },
            temperature = 0.2,
            top_p = 1,
            max_tokens = 2048,
            stream = false
        };

        try
        {
            var responseText = await CallLlmAsync(requestBody);
            
            // Clean JSON response (remove markdown code fences if any)
            responseText = CleanJson(responseText);

            var result = JsonSerializer.Deserialize<CopilotInsightResult>(responseText, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? new CopilotInsightResult
            {
                Summary = "Failed to parse insights.",
                Answer = "The AI returned a response that could not be parsed as JSON.",
                Confidence = "low"
            };
        }
        catch (Exception ex)
        {
            return new CopilotInsightResult
            {
                Summary = "Error generating insights.",
                Answer = $"An error occurred while generating insights: {ex.Message}",
                Confidence = "low"
            };
        }
    }

    private async Task<string> CallLlmAsync(object requestBody)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, _options.Endpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
        
        var json = JsonSerializer.Serialize(requestBody);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseContent);
        
        var choices = doc.RootElement.GetProperty("choices");
        if (choices.GetArrayLength() > 0)
        {
            var message = choices[0].GetProperty("message");
            return message.GetProperty("content").GetString() ?? string.Empty;
        }

        return string.Empty;
    }

    private string CleanSql(string sql)
    {
        // Remove code block wrappers
        sql = Regex.Replace(sql, @"^```sql\s*", "", RegexOptions.IgnoreCase);
        sql = Regex.Replace(sql, @"^```\s*", "");
        sql = Regex.Replace(sql, @"\s*```$", "");
        return sql.Trim();
    }

    private string CleanJson(string json)
    {
        json = Regex.Replace(json, @"^```json\s*", "", RegexOptions.IgnoreCase);
        json = Regex.Replace(json, @"^```\s*", "");
        json = Regex.Replace(json, @"\s*```$", "");
        return json.Trim();
    }

    private void ValidateSql(string sql)
    {
        var trimmed = sql.Trim();
        
        // 1. Must start with SELECT
        if (!trimmed.StartsWith("SELECT", StringComparison.OrdinalIgnoreCase) &&
            !trimmed.StartsWith("WITH", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Query validation failed: Only SELECT or CTE queries are allowed.");
        }

        // 2. Forbidden keywords check
        var forbiddenKeywords = new[]
        {
            "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "TRUNCATE",
            "CALL", "CREATE", "GRANT", "REVOKE", "COPY", "VACUUM",
            "ANALYZE", "DO", "EXECUTE"
        };

        foreach (var keyword in forbiddenKeywords)
        {
            if (Regex.IsMatch(trimmed, $@"\b{keyword}\b", RegexOptions.IgnoreCase))
            {
                throw new InvalidOperationException($"Query validation failed: Forbidden keyword '{keyword}' detected.");
            }
        }

        // 3. Whitelist allowed objects
        // Must reference analytics.vw_dashboard_summary and nothing else
        if (!trimmed.Contains("analytics.vw_dashboard_summary", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Query validation failed: Query must reference 'analytics.vw_dashboard_summary'.");
        }

        // Reject references to other schemas/tables
        var forbiddenPatterns = new[]
        {
            @"warehouse\.", @"metadata\.", @"public\.", @"pg_catalog", @"information_schema"
        };

        foreach (var pattern in forbiddenPatterns)
        {
            if (Regex.IsMatch(trimmed, pattern, RegexOptions.IgnoreCase))
            {
                throw new InvalidOperationException($"Query validation failed: Access to system tables or other schemas is forbidden.");
            }
        }
    }

    private async Task<CopilotDataResult> ExecuteSqlAsync(string sql)
    {
        // Automatically append LIMIT 500 if no LIMIT exists
        if (!Regex.IsMatch(sql, @"\bLIMIT\b", RegexOptions.IgnoreCase))
        {
            // Remove trailing semicolon if any
            sql = sql.TrimEnd(';');
            sql += " LIMIT 500;";
        }

        using var conn = _dbFactory.CreateConnection();
        await conn.OpenAsync();

        using var cmd = conn.CreateCommand();
        cmd.CommandText = sql;
        cmd.CommandTimeout = 10; // 10 seconds timeout

        using var reader = await cmd.ExecuteReaderAsync();

        var columns = new List<string>();
        for (int i = 0; i < reader.FieldCount; i++)
        {
            columns.Add(reader.GetName(i));
        }

        var rows = new List<List<object>>();
        while (await reader.ReadAsync())
        {
            var row = new List<object>();
            for (int i = 0; i < reader.FieldCount; i++)
            {
                var val = reader.GetValue(i);
                // Convert DBNull to null
                row.Add(val == DBNull.Value ? null! : val);
            }
            rows.Add(row);
        }

        return new CopilotDataResult
        {
            Columns = columns,
            Rows = rows
        };
    }
}
