using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using PasswordManager.Server.Data.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.DatabaseContexts;
using System.Text.RegularExpressions;

namespace PasswordManager.Server.Data.Entities
{
    public class BankAccount
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string BankName { get; set; }
        public string AccountType { get; set; }
        public int RoutingNumber { get; set; }
        public int AccountNumber { get; set; }
        public int SWIFTCode { get; set; }
        public string IBANNumber { get; set; }
        public int PIN {  get; set; }
        public string BranchAddress { get; set; }
        public int BranchPhone { get; set; }
        public string Notes { get; set; }
    }

    public class BankAccountEntityValidator : AbstractValidator<BankAccount>
    {
        public BankAccountEntityValidator()
        {
            //RuleFor(x => x.Name).Length(250).WithMessage("Name must be between 1 and 250 characters in length.");
            //RuleFor(x => x.BankName).Length(250).WithMessage("Bank Name must be between 1 and 250 characters in length.");
            // RuleFor(x => x.AccountType).Must(BeValidAccountType).WithMessage("Not a valid checking account type.");
            // RuleFor(x => x.RoutingNumber).Must(BeValidRoutingNumber).WithMessage("Invalid routing number provided.");
            // RuleFor(x => x.SWIFTCode).Must(BeValidSWIFTCode).WithMessage("Invalid SWIFT code provided.");
            // RuleFor(x => x.IBANNumber).Must(BeValidIBANNumber).WithMessage("Invalid IBAN code provided.");
            // RuleFor(x => x.Notes).Length(1, 1000).WithMessage("Notes can be no longer than 1000 characters in length");
        }

        // Could also just create an enum
        private bool BeValidAccountType(string accountType) =>
            accountType.Equals("Checking", StringComparison.OrdinalIgnoreCase) || accountType.Equals("Savings", StringComparison.OrdinalIgnoreCase);

        private bool BeValidRoutingNumber(int routingNumber)
        {
            bool isCorrectLength = routingNumber.ToString().Length == 9;
            return isCorrectLength;
        }

        private bool BeValidSWIFTCode(int swiftCode)
        {
            string code = swiftCode.ToString();
            bool isValidLength = code.Length >= 8 && code.Length <= 11;
            return isValidLength;
        }

        private bool BeValidIBANNumber(string IBANNumber)
        {
            bool isAlphaNumeric = new Regex(@"").Matches(IBANNumber).Any();
            bool isCorrectLength = IBANNumber.Length <= 34;
            return isAlphaNumeric && isCorrectLength;
        }
    }
}
