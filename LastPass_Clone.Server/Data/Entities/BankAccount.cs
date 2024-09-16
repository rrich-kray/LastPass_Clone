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
        public int? CategoryId { get; set; }
        [Required]
        public string Name { get; set; }
        public string? BankName { get; set; }
        public string? AccountType { get; set; }
        public string? RoutingNumber { get; set; }
        public string? AccountNumber { get; set; }
        public string? SWIFTCode { get; set; }
        public string? IBANNumber { get; set; }
        public string? PIN {  get; set; }
        public string? BranchAddress { get; set; }
        public string? BranchPhone { get; set; }
        public string? Notes { get; set; }
    }

    public class BankAccountEntityValidator : AbstractValidator<BankAccount>
    {
        public BankAccountEntityValidator()
        {
            RuleFor(x => x.Name).Length(1, 255).WithMessage("Name must be between 1 and 255 characters.");
            When(x => x.BankName != "", () => RuleFor(x => x.BankName).Length(1, 255).WithMessage("When it exists, bank name must be between 1 and 255 characters in length."));
            When(x => x.AccountType != "", () => RuleFor(x => x.AccountType).Length(1, 255).WithMessage("When it exists, account type must be between 1 and 255 characters in length."));
            When(x => x.BranchAddress != "", () => RuleFor(x => x.BranchAddress).Length(1, 255).WithMessage("When it exists, branch address must be between 1 and 255 characters in length."));
            When(x => x.Notes != "", () => RuleFor(x => x.Notes).Length(1, 10000).WithMessage("When it exists, notes must be between 1 and 10000 characters in length."));
            When(x => x.RoutingNumber != "", () => RuleFor(x => x.RoutingNumber).Length(9).WithMessage("When it exists, the routing number must be 9 digits in length."));
            When(x => x.AccountNumber != "", () => RuleFor(x => x.AccountNumber).Length(1, 255).WithMessage("When it exists, the account number must be between 1 and 255 characters in length."));
            When(x => x.IBANNumber != "", () => RuleFor(x => x.IBANNumber).Length(1, 34).WithMessage("When it exists, IBAN number must be between 1 and 34 characters in length."));
            When(x => x.SWIFTCode != "", () => RuleFor(x => x.SWIFTCode).Length(1, 255).WithMessage("Invalid SWIFT code provided."));
        }

        private bool BeValidSWIFTCode(string swiftCode)
        {
            return new Regex(@"^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$").Matches(swiftCode).Any();
        }

        private bool BeValidIBANNumber(string IBANNumber)
        {
            bool isAlphaNumeric = new Regex(@"").Matches(IBANNumber).Any();
            bool isCorrectLength = IBANNumber.Length <= 34;
            return isAlphaNumeric && isCorrectLength;
        }
    }
}
