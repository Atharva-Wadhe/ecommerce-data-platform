using Microsoft.Extensions.Options;
using Npgsql;
using ShopSphere.Api.Configuration;

namespace ShopSphere.Api.Database;

public class DbConnectionFactory
{
    private readonly DatabaseOptions _options;

    public DbConnectionFactory(IOptions<DatabaseOptions> options)
    {
        _options = options.Value;
    }

    public NpgsqlConnection CreateConnection()
    {
        if (string.IsNullOrEmpty(_options.AnalyticsDb))
        {
            throw new InvalidOperationException("The connection string 'AnalyticsDb' is not configured.");
        }

        return new NpgsqlConnection(_options.AnalyticsDb);
    }
}
