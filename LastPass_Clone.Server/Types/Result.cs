namespace PasswordManager.Server.Types
{
    public class Response
    {
        public bool Result { get; set; }
        public IEnumerable<string> Message { get; set; }
    }
}
