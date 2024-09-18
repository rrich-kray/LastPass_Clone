using PasswordManager.Server.Data.DatabaseContexts;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Middleware;
using PasswordManager.Server.Data.Entities;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity.UI.Services;
using PasswordManager.Server.Services;
using JwtBearerExtensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<PasswordManagerDatabaseContext>(options =>
    options.UseSqlite(builder.Configuration["ConnectionStrings:PasswordDatabaseConnection"])
);

// As a client logs onto the server, and tries to grab an instance of this,
// Take the generic IPasswordManagerRepository and create an instance of the PasswordManagerRepository
// So that everybody has their own class in memory on the server
builder.Services.AddScoped<AddressRepository, AddressRepository>();
builder.Services.AddScoped<BankAccountRepository, BankAccountRepository>();
builder.Services.AddScoped<CategoryRepository, CategoryRepository>();
builder.Services.AddScoped<PasswordRepository, PasswordRepository>();
builder.Services.AddScoped<PaymentCardRepository, PaymentCardRepository>();
builder.Services.AddScoped<NoteRepository, NoteRepository>();

builder.Services.AddAuthorization();
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<PasswordManagerDatabaseContext>();

/*
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.Configure<AuthMessageSenderOptions>(builder.Configuration);
*/

var app = builder.Build();

//app.UseNoHtmlMiddleware();

app.UseCors(builder => 
    builder
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapIdentityApi<User>();
app.UseAuthorization();


app.MapPost("/logout", async (SignInManager<User> SignInManager) =>
{
    await SignInManager.SignOutAsync();
    return Results.Ok();
}).RequireAuthorization();

app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email);
    return Results.Json(new { email = email });
}).RequireAuthorization();

app.MapGet("/verifytoken", (UserManager<User> UserManager, string token, string userEmail) =>
{
    bool isTokenValid = false;
    User? user = UserManager.FindByEmailAsync(userEmail).Result;
    if (user is not null)
    {
        isTokenValid = UserManager.VerifyUserTokenAsync(user, UserManager.Options.Tokens.EmailConfirmationTokenProvider, "EmailConfirmation", token).Result;
    } else
    {
        return Results.Json(new { result = "An invalid email address was provided." });
    }
    return Results.Json(new { user = user, result = isTokenValid });
});

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
