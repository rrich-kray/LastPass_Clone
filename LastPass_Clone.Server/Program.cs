using PasswordManager.Server.Data.DatabaseContexts;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Middleware;
using PasswordManager.Server.Data.Entities;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
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

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
