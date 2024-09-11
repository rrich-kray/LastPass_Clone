using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using PasswordManager.Server.Data.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.DatabaseContexts;
using System.Text.RegularExpressions;

namespace PasswordManager.Server.Data.Entities
{
    public class Note
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        [Required]
        public string Content { get; set; }
    }

    public class NoteEntityValidator : AbstractValidator<Note>
    {
        public NoteEntityValidator()
        {
            //RuleFor(x => x.Content).Length(10000).WithMessage("Length of note content must be less than 10000 characters");
            RuleFor(x => x.Name).Length(1, 255).WithMessage("Length of Note Name must be less than 255 characters.");
        }
    }
}
