using PasswordManager.Server.Data.DatabaseContexts;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Middleware;
using PasswordManager.Server.Data.Entities;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using PasswordManager.Server.Services.JwtAuth;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Azure;
using System.IO;
using Microsoft.Extensions.Hosting.Internal;
using PasswordManager.Server.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.PrivateKey)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});
builder.Services.AddTransient<AuthService>();
builder.Services.AddAuthorization();

// Add services to the container.
builder.Services.AddControllers().AddNewtonsoftJson();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

/*
if (!Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")))
{
    Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"));
}
*/

//if (!Directory.Exists("/home")) Directory.CreateDirectory("/home"); 

// I think this is creating the database, but it just can't be opened due to a locking or permissions issue
builder.Services.AddDbContext<PasswordManagerDatabaseContext>(options =>
     options.UseSqlite(
         builder.Environment.IsDevelopment() 
         ? new SqliteConnectionStringBuilder()
         {
             DataSource = builder.Configuration["ConnectionStrings:Development"]!.Split("=")[1],
             DefaultTimeout = 5000
         }.ToString()
         : new SqliteConnectionStringBuilder()
         {
             DataSource = builder.Configuration["ConnectionStrings:Production"]!.Split("=")[1],
             DefaultTimeout = 5000
         }.ToString()  /*builder.Configuration["ConnectionStrings:Production"]*/)
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
builder.Services.AddScoped<UserRepository, UserRepository>();
builder.Services.AddScoped<PasswordResetCodeRepository, PasswordResetCodeRepository>();

builder.Services.AddHttpsRedirection(options =>
{
    options.RedirectStatusCode = 300;
    options.HttpsPort = 5001;
});
builder.Services.AddAzureClients(clientBuilder =>
{
    clientBuilder.AddBlobServiceClient(builder.Configuration["Database:blob"]!, preferMsi: true);
    clientBuilder.AddQueueServiceClient(builder.Configuration["Database:queue"]!, preferMsi: true);
});

// Logging
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Trace);

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseDeveloperExceptionPage();

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

app.UseAuthorization();

app.MapControllers().RequireAuthorization();

app.MapFallbackToFile("/index.html");

app.UseHttpsRedirection();

using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
{
    var logger = serviceScope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    var db = serviceScope.ServiceProvider.GetRequiredService<PasswordManagerDatabaseContext>().Database;

    logger.LogInformation("Creating database...");
    if (!db.CanConnect())
    {
        try
        {
            db.Migrate();
            logger.LogInformation("Database created successfully.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, ex.Message);
        }
    }

}



app.Run();
