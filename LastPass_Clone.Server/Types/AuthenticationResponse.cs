using PasswordManager.Server.Data.Entities;

namespace PasswordManager.Server.Types
{
    public class AuthenticationResponse
    {
        public User? User { get; set; }
        public bool? Result { get; set; }
        public string? Token { get; set; }
        public List<string>? Messages { get; set; }
    }
}
