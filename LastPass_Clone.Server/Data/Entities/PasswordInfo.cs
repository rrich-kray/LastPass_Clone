using FluentValidation;
using PasswordManager.Server.Types;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;

namespace PasswordManager.Server.Data.Entities
{
    public class PasswordInfo
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }
        public int? CategoryId { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Website { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Notes { get; set; }
        
    }
    public class PasswordEntityValidator : AbstractValidator<PasswordInfo>
    {
        public PasswordEntityValidator()
        {
            RuleFor(x => x.Website)
                .Length(1, 500)
                .When(x => x.Website != "")
                .WithMessage("Website cannot be greater than 500 characters in length");

            RuleFor(x => x.Username)
                .Length(1, 500)
                .When(x => x.Username != "")
                .WithMessage("Username cannot be greater than 500 characters in length");

            RuleFor(x => x.Password)
                .Length(1, 500)
                .When(x => x.Password != "")
                .WithMessage("Password cannot be greater than 500 characters in length");

            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Name is required")
                .Length(1, 500)
                .WithMessage("Name cannot be greater than 500 characters in length.");
        }
    }

}
