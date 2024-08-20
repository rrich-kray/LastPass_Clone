using System.Security;
using System.Text.RegularExpressions;

namespace PasswordManager.Server.Middleware
{
    public static class CustomMiddlewareExtensions
    {
        public static IApplicationBuilder UseNoHtmlMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<NoHtmlMiddleware>();
        }
    }
    public class NoHtmlMiddleware
    {
        private readonly RequestDelegate _next;

        public NoHtmlMiddleware(RequestDelegate next)
        {
            this._next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Get request body, read as string, replace html tags using regex, convert into stream, set new stream as body
            // Optionally could not invoke _next and prevent request from moving further down the pipeline if it contains html tags
            string? reqBodyString = context.Request.Body?.ToString();
            if (!String.IsNullOrWhiteSpace(reqBodyString))
            {
                new Regex(@"^(?!.*<[^>]+>).*").Replace(reqBodyString, "");
                Stream stream = new MemoryStream();
                StreamWriter writer = new StreamWriter(stream);
                writer.Write(reqBodyString);
                writer.Flush();
                stream.Position = 0;
                context.Request.Body = stream;
            }

            await this._next(context);
        }
    }
}
