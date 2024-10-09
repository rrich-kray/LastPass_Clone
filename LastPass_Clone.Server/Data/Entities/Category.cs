using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace PasswordManager.Server.Data.Entities
{

    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }
        public Nullable<int> UserId { get; set; }
        [Required]
        public string Name { get; set; }

    }

    public class CategoryEntityValidator : AbstractValidator<Category>
    {
        public CategoryEntityValidator()
        {
            //RuleFor(x => x.Name).Length(1, 255).WithMessage("Name must be between 1 and 255 characters.");
        }
    }
}
