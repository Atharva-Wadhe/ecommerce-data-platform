using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using ShopSphere.Api.Models.Common;
using ShopSphere.Api.Models.Requests;
using ShopSphere.Api.Models.Responses;
using ShopSphere.Api.Services;

namespace ShopSphere.Api.Endpoints;

public static class CopilotEndpoints
{
    public static void MapCopilotEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/copilot")
            .WithTags("Copilot");

        group.MapPost("/chat", async Task<IResult> (CopilotChatRequest request, AiCopilotService copilotService) =>
        {
            if (string.IsNullOrWhiteSpace(request.Question))
            {
                return Results.BadRequest(new ErrorResponse { Message = "Question cannot be empty." });
            }

            try
            {
                var response = await copilotService.ProcessQuestionAsync(request.Question);
                return Results.Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(new ErrorResponse { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return Results.InternalServerError(new ErrorResponse { Message = $"An error occurred: {ex.Message}" });
            }
        })
        .WithName("CopilotChat")
        .Produces<CopilotChatResponse>(StatusCodes.Status200OK)
        .Produces<ErrorResponse>(StatusCodes.Status400BadRequest)
        .Produces<ErrorResponse>(StatusCodes.Status500InternalServerError);
    }
}
