namespace PasswordManager.Server.Data.Entities
{
    public class AccountVerificationCode
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Key { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime SendDate { get; set; }

    }
}
