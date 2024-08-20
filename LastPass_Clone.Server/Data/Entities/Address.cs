using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using PasswordManager.Server.Data.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.DatabaseContexts;
using System.Text.RegularExpressions;

namespace PasswordManager.Server.Data.Entities
{
    public class Address
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string AddressName { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string UserName {  get; set; }
        public string Gender { get; set; }
        public DateTime Birthday { get; set; }
        public string Company { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
        public string County { get; set; }
        public string State { get; set; }
        [RegularExpression("^\\d{5}(?:[-\\s]\\d{4})?$", ErrorMessage = "Invalid Zip Code")]
        public int ZipCode { get; set; }
        public string Country { get; set; }
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string EmailAddress {  get; set; }
        [Phone(ErrorMessage = "Invalid phone number")]
        public int PhoneNumber { get; set; }
        [Phone(ErrorMessage = "Invalid Phone Number")]
        public int EveningPhone { get; set; }
        [Phone(ErrorMessage = "Invalid Phone Number")]
        public int MobilePhone { get; set; }
        [Phone(ErrorMessage = "Invalid Fax Number")]
        public int Fax { get; set; }
        public string Notes { get; set; }

    }

    public class AddressEntityValidator: AbstractValidator<Address>
    {
        public AddressEntityValidator()
        {
            RuleFor(x => x.FirstName).Must(BeValidName).Length(1, 250).WithMessage("Provided name is not valid.");
            RuleFor(x => x.MiddleName).Must(BeValidName).Length(1, 250).WithMessage("Provided name is not valid.");
            RuleFor(x => x.LastName).Must(BeValidName).Length(1, 250).WithMessage("Provided name is not valid.");
            RuleFor(x => x.UserName).Length(1, 250).WithMessage("Username must be between 1 and 250 characters in length");
            RuleFor(x => x.UserName).Length(1, 250).WithMessage("Username must be between 1 and 250 characters in length");
            RuleFor(x => x.Address1).Length(1, 250).WithMessage("Address must be between 1 and 250 characters in length");
            RuleFor(x => x.Address2).Length(1, 250).WithMessage("Address must be between 1 and 250 characters in length");
            RuleFor(x => x.Address3).Length(1, 250).WithMessage("Address must be between 1 and 250 characters in length");
            RuleFor(x => x.City).Length(1, 250).WithMessage("City must be between 1 and 250 characters in length");
            RuleFor(x => x.State).Length(2).WithMessage("State must be a two character abbreviation.");
            RuleFor(x => x.Notes).Length(1000).WithMessage("Note must be no longer than 1000 characters.");
        }

        private bool BeValidName(string name) =>
            new Regex(@"^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$").Matches(name).Any();
    }
}
