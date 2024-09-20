using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;

namespace PasswordManager.Server.Data.Repositories
{
    public class PasswordRepository : IPasswordManagerRepository<PasswordInfo>
    {
        public PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; set; }
        public PasswordRepository(PasswordManagerDatabaseContext passwordManagerDatabaseContext)
        {
            this.PasswordManagerDatabaseContext = passwordManagerDatabaseContext;
        }

        public IEnumerable<PasswordInfo> Passwords => this.PasswordManagerDatabaseContext.Passwords;
        public PasswordInfo Create(PasswordInfo password)
        {
            try
            {
                var newPassword = this.PasswordManagerDatabaseContext.Passwords.Add(password);
                this.SaveChanges();
                return newPassword.Entity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public PasswordInfo Update(PasswordInfo password)
        {
            try
            {
                var updatedPassword = this.PasswordManagerDatabaseContext.Passwords.Update(password);
                this.SaveChanges();
                return updatedPassword.Entity;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        public void Delete(int passwordId)
        {
            try
            {
                PasswordInfo? currentPassword = this.PasswordManagerDatabaseContext.Passwords?.FirstOrDefault(x => x.Id == passwordId);
                if (currentPassword is not null)
                {
                    this.PasswordManagerDatabaseContext.Remove(currentPassword);
                    this.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public IEnumerable<PasswordInfo> GetPasswordsForCategory(int categoryId) =>
            this.PasswordManagerDatabaseContext.Passwords.Where(x => x.CategoryId == categoryId);
        
        public void SaveChanges() => this.PasswordManagerDatabaseContext.SaveChanges();
    }
}
