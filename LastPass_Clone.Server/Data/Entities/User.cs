using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace PasswordManager.Server.Data.Entities
{
    public class User: IdentityUser
    {
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
    }

    public class UserEntityValidator : AbstractValidator<User>
    {
        public UserEntityValidator()
        {
            RuleFor(x => x.Email).Length(1, 500);
            //RuleFor(x => x.Password).Length(1, 500);
            RuleFor(x => x.FirstName).Length(1, 500).When(x => x.FirstName != "");
            RuleFor(x => x.MiddleName).Length(1, 500).When(x => x.MiddleName != "");
            RuleFor(x => x.LastName).Length(1, 500).When(x => x.LastName != "");
        }
    }
}
