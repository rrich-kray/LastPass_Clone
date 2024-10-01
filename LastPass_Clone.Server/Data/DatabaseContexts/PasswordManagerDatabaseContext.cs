using PasswordManager.Server.Configuration;
using Microsoft.EntityFrameworkCore;
using PasswordManager.Server.Data.Entities;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace PasswordManager.Server.Data.DatabaseContexts
{
    public class PasswordManagerDatabaseContext : DbContext
    {
        public PasswordManagerDatabaseContext(DbContextOptions<PasswordManagerDatabaseContext> options) : base(options) { }
        public DbSet<PasswordInfo> Passwords { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<PaymentCard> PaymentCards { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>();
            modelBuilder.Entity<Note>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Note>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<PasswordInfo>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<PasswordInfo>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<Address>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<Address>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<PaymentCard>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<PaymentCard>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<BankAccount>()
                .HasOne<Category>()
                .WithMany()
                .HasForeignKey(p => p.CategoryId);

            modelBuilder.Entity<BankAccount>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(p => p.UserId);

        }
    }
}
