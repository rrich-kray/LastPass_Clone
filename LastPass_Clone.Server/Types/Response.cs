namespace PasswordManager.Server.Types
{
    public class Response
    {
        public bool Result { get; set; }
        public List<string> Message = new List<string>();
    }
}
