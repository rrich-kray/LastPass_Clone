using System.Text.RegularExpressions;
using System.ComponentModel.DataAnnotations;

namespace PasswordManager.Server.Services
{
    public class VerificationService
    {
        public VerificationService() { }

        public bool VerifyEmail(string email) => email != null && new EmailAddressAttribute().IsValid(email);

        public bool VerifyPassword(string password, int lengthRequirement)
        {
            bool meetsLengthRequirement = password.Length > 8;
            bool hasNumber = new Regex(@"[0-9]+").IsMatch(password);
            bool hasUppercaseLetter = new Regex(@"[A-Z]+").IsMatch(password);
            return 
                meetsLengthRequirement &&
                hasNumber &&
                hasUppercaseLetter;
        }
    }
}
