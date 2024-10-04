using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;

namespace PasswordManager.Server.Data.Repositories
{
    public class PasswordResetCodeRepository : IPasswordManagerRepository<PasswordResetCode>
    {
        public IEnumerable<PasswordResetCode> passwordResetCodes => PasswordManagerDatabaseContext.PasswordResetCodes;
        public PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; set; }
        public PasswordResetCodeRepository(PasswordManagerDatabaseContext passwordManagerDatabaseContext)
        {
            this.PasswordManagerDatabaseContext = passwordManagerDatabaseContext;
        }

        public PasswordResetCode Create(PasswordResetCode passwordResetCode)
        {
            try
            {
                var newPasswordResetCode = this.PasswordManagerDatabaseContext.PasswordResetCodes.Add(passwordResetCode);
                this.SaveChanges();
                return newPasswordResetCode.Entity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public PasswordResetCode Update(PasswordResetCode passwordResetCode)
        {
            try
            {
                var currentPasswordResetCode = this.PasswordManagerDatabaseContext.PasswordResetCodes.Update(passwordResetCode);
                this.SaveChanges();
                return currentPasswordResetCode.Entity;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Delete(int passwordResetCodeId)
        {
            try
            {
                Address? currentPasswordResetCode = this.PasswordManagerDatabaseContext.Addresses?.FirstOrDefault(x => x.Id == passwordResetCodeId);
                if (currentPasswordResetCode is not null)
                {
                    this.PasswordManagerDatabaseContext.Remove(currentPasswordResetCode);
                    this.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void SaveChanges() => this.PasswordManagerDatabaseContext.SaveChanges();
    }
}
