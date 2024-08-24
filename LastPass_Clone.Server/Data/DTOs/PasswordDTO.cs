namespace PasswordManager.Server.Data.DTOs
{
    public class PasswordDTO
    {
        public string Website { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Notes { get; set; }
        public int CategoryId { get; set; }
    }
}
