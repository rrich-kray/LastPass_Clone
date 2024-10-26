using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;

namespace PasswordManager.Server.Data.Repositories
{
    public class AccountVerificationCodeRepository : IPasswordManagerRepository<AccountVerificationCode>
    {
        public IEnumerable<AccountVerificationCode> AccountVerificationCodes => PasswordManagerDatabaseContext.AccountVerificationCodes;
        public PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; set; }
        public AccountVerificationCodeRepository(PasswordManagerDatabaseContext passwordManagerDatabaseContext)
        {
            this.PasswordManagerDatabaseContext = passwordManagerDatabaseContext;
        }

        public AccountVerificationCode Create(AccountVerificationCode accountVerificationCode)
        {
            try
            {
                var newVerificationCode = this.PasswordManagerDatabaseContext.AccountVerificationCodes.Add(accountVerificationCode);
                this.SaveChanges();
                return newVerificationCode.Entity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public AccountVerificationCode Update(AccountVerificationCode accountVerificationCode)
        {
            try
            {
                var currentAccountVerificationCode = this.PasswordManagerDatabaseContext.AccountVerificationCodes.Update(accountVerificationCode);
                this.SaveChanges();
                return currentAccountVerificationCode.Entity;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Delete(int accountVerificationCodeId)
        {
            try
            {
                Address? currentAccountVerificationCode = this.PasswordManagerDatabaseContext.Addresses?.FirstOrDefault(x => x.Id == accountVerificationCodeId);
                if (currentAccountVerificationCode is not null)
                {
                    this.PasswordManagerDatabaseContext.Remove(currentAccountVerificationCode);
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
