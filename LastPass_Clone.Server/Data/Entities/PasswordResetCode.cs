using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace PasswordManager.Server.Data.Entities
{
    public class PasswordResetCode
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int Id { get; set; }
        [Required]
        public int UserId { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public DateTime Expiration { get; set; }
    }
}
