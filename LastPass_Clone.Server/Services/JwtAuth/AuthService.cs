using System.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PasswordManager.Server.Data.Entities;
using Microsoft.AspNetCore.Http;

namespace PasswordManager.Server.Services.JwtAuth;
public class AuthService
{
    public string Create(User user)
    {
        var handler = new JwtSecurityTokenHandler();

        var privateKey = Encoding.UTF8.GetBytes(Configuration.PrivateKey);

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(privateKey),
            SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            SigningCredentials = credentials,
            Expires = DateTime.UtcNow.AddHours(1),
            Subject = GenerateClaims(user)
        };

        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

    public class DecodedToken
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? Message { get; set; }
    }

    public DecodedToken Decode(string token)
    {
        string secret = Configuration.PrivateKey; // Is this excluded from version control?
        var key = Encoding.ASCII.GetBytes(secret);
        var handler = new JwtSecurityTokenHandler();
        var validations = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false
        };
        var decodedToken = handler.ValidateToken(token, validations, out var tokenSecure);
        var userEmail = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("email", StringComparison.OrdinalIgnoreCase))?.Value;
        var userId = decodedToken.Claims.FirstOrDefault(x => x.Type.Equals("id", StringComparison.OrdinalIgnoreCase))?.Value;
        return new DecodedToken { Id = userId, Email = userEmail, Message = "Token decoded successfully." };
    }

    private static ClaimsIdentity GenerateClaims(User user)
    {
        var ci = new ClaimsIdentity();

        ci.AddClaim(new Claim(type: "id", value: user.Id.ToString()));
        ci.AddClaim(new Claim(type: "email", value: user.Email));

        return ci;
    }
}