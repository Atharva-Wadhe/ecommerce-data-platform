using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ShopSphere.Api.Configuration;
using ShopSphere.Api.Database;
using ShopSphere.Api.Repositories;
using ShopSphere.Api.Services;

namespace ShopSphere.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<DatabaseOptions>(configuration.GetSection(DatabaseOptions.SectionName));
        services.Configure<AiOptions>(configuration.GetSection(AiOptions.SectionName));

        services.AddSingleton<DbConnectionFactory>();
        services.AddScoped<DashboardRepository>();
        services.AddScoped<DashboardService>();
        
        services.AddHttpClient<AiCopilotService>();
        services.AddScoped<AiCopilotService>();

        return services;
    }
}
