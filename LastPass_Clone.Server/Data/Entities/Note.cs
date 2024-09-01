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
        [Required]
        public string Content { get; set; }
    }

    public class NoteEntityValidator : AbstractValidator<Note>
    {
        public NoteEntityValidator()
        {
            RuleFor(x => x.Content).Length(1, 10000).WithMessage("");
        }
    }
}
