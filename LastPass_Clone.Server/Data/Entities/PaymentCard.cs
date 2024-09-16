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
        public int? CategoryId { get; set; }
        [Required]
        public string Name { get; set; }
        public string? NameOnCard { get; set; }
        public string? Type {  get; set; }
        public string? Number { get; set; }
        public int? SecurityCode { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string? Notes { get; set; }
    }

    public class PaymentCardEntityValidator : AbstractValidator<PaymentCard>
    {
        public PaymentCardEntityValidator()
        {
            When(x => x.NameOnCard != "", () => RuleFor(x => x.NameOnCard).Length(1, 255).WithMessage("Name on card cannot be more than 255 characters in length."));
            When(x => x.Type != "", () => RuleFor(x => x.Type).Length(1, 255).WithMessage("Payment card type cannot be more than 255 characters in length."));
            When(x => x.Number != "", () => RuleFor(x => x.Number).Length(1, 255).WithMessage("Card number cannot be more than 255 characters in length."));
            When(x => x.SecurityCode is not null, () => RuleFor(x => x.SecurityCode).Must(BeValidSecurityCode).WithMessage("Security code must be three digits in length."));
            When(x => x.Notes != "", () => RuleFor(x => x.Notes).Length(1, 255).WithMessage("Notes cannot be more than 255 characters in length."));
        }

        private bool BeValidSecurityCode(int? securityCode)
        {
            return securityCode.ToString()?.Length == 3;
        }
    }
}
