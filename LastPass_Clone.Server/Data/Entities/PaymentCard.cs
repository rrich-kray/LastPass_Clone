using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using PasswordManager.Server.Data.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.DatabaseContexts;
using System.Text.RegularExpressions;

namespace PasswordManager.Server.Data.Entities
{
    public class PaymentCard
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; } 
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string NameOnCard { get; set; }
        public string Type {  get; set; }
        public int Number { get; set; }
        public int SecurityCode { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string Notes { get; set; }
    }

    public class PaymentCardEntityValidator : AbstractValidator<PaymentCard>
    {
        public PaymentCardEntityValidator()
        {
            RuleFor(x => x.SecurityCode).Must(BeValidSecurityCode).WithMessage("Invalid security code provided.");
        }

        private bool BeValidSecurityCode(int securityCode) =>
            securityCode.ToString().Length == 3;
    }
}
