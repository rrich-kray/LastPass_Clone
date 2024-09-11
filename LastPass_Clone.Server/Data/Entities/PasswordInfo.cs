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
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Website { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public string Notes { get; set; }
        
    }
    public class PasswordEntityValidator : AbstractValidator<PasswordInfo>
    {
        public PasswordEntityValidator()
        {
            //RuleFor(x => x.Website).Must(BeValidDomain).WithMessage("Website provided is not valid.");
            RuleFor(x => x.Username).NotEmpty().WithMessage("Username cannot be empty.");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password cannot be empty.");
        }

        private bool BeValidDomain(string website) =>
            new Regex(@"^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$").Matches(website).Any();
    }

}
