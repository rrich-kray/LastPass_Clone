using PasswordManager.Server.Configuration;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.Entities;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace PasswordManager.Server.Data.DatabaseContexts
{
    public class PasswordManagerDatabaseContext : IdentityDbContext<User>
    {
        public PasswordManagerDatabaseContext(DbContextOptions<PasswordManagerDatabaseContext> options) : base(options) { }
        public DbSet<PasswordInfo> Passwords { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<PaymentCard> PaymentCards { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<User> Users {  get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Note>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<PasswordInfo>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Address>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<PaymentCard>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<BankAccount>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<User>();

            modelBuilder.Entity<Category>().HasData(
                    new Category
                    {
                        Id = 1,
                        Name = "Business",
                    },
                    new Category
                    {
                        Id = 2,
                        Name = "Arts"
                    },
                    new Category
                    {
                        Id = 3,
                        Name = "Productivity Tools"
                    },
                    new Category
                    {
                        Id = 4,
                        Name = "Shopping"
                    },
                    new Category
                    {
                        Id = 5,
                        Name = "Email"
                    },
                    new Category
                    {
                        Id = 6,
                        Name = "Social"
                    },
                    new Category
                    {
                        Id = 7,
                        Name = "Entertainment"
                    }
                );
        }
    }
}
