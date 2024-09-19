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

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

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


app.Run();
