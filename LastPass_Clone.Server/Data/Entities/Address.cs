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
        [Required]
        public int UserId { get; set; }
        public int? CategoryId { get; set; }
        [Required]
        public string Name { get; set; }
        public string? Title { get; set; }
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? UserName {  get; set; }
        public string? Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string? Company { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Address3 { get; set; }
        public string? City { get; set; }
        public string? County { get; set; }
        public string? State { get; set; }
        public int? ZipCode { get; set; }
        public string? Country { get; set; }
        public string? EmailAddress {  get; set; }
        public int? PhoneNumber { get; set; }
        public int? EveningPhone { get; set; }
        public int? MobilePhone { get; set; }
        public int? Fax { get; set; }
        public string? Notes { get; set; }

    }

    public class AddressEntityValidator: AbstractValidator<Address>
    {
        public AddressEntityValidator()
        {
            When(x => x.Title != "", () => RuleFor(x => x.Title).Length(1, 500));
            When(x => x.FirstName != "", () => RuleFor(x => x.FirstName).Length(1, 500));
            When(x => x.MiddleName != "", () => RuleFor(x => x.MiddleName).Length(1, 500));
            When(x => x.LastName != "", () => RuleFor(x => x.LastName).Length(1, 500));
            When(x => x.UserName != "", () => RuleFor(x => x.UserName).Length(1, 500));
            When(x => x.Gender != "", () => RuleFor(x => x.Gender).Length(1, 500));
            When(x => x.Company != "", () => RuleFor(x => x.Company).Length(1, 500));
            When(x => x.Address1 != "", () => RuleFor(x => x.Address1).Length(1, 500));
            When(x => x.Address2 != "", () => RuleFor(x => x.Address2).Length(1, 500));
            When(x => x.Address3 != "", () => RuleFor(x => x.Address3).Length(1, 500));
            When(x => x.City != "", () => RuleFor(x => x.City).Length(1, 500));
            When(x => x.County != "", () => RuleFor(x => x.County).Length(1, 500));
            When(x => x.State != "", () => RuleFor(x => x.State).Length(1, 500));
            When(x => x.Country != "", () => RuleFor(x => x.Country).Length(1, 500));
            When(x => x.EmailAddress != "", () => RuleFor(x => x.EmailAddress).Length(1, 500));
            When(x => x.Notes != "", () => RuleFor(x => x.Notes).Length(1, 10000));
        }
        
        private bool BeValidName(string name) =>
            new Regex(@"^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$").Matches(name).Any();
    }
}
