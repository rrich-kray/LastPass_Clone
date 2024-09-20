using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;

namespace PasswordManager.Server.Data.Repositories
{
    public class BankAccountRepository : IPasswordManagerRepository<BankAccount>
    {
        public PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; set; }
        public IEnumerable<BankAccount> BankAccounts => PasswordManagerDatabaseContext.BankAccounts;
        public BankAccountRepository(PasswordManagerDatabaseContext passwordManagerDatabaseContext)
        {
            this.PasswordManagerDatabaseContext = passwordManagerDatabaseContext;
        }

        public BankAccount Create(BankAccount bankAccount)
        {
            try
            {
                var newBankAccount = this.PasswordManagerDatabaseContext.BankAccounts.Add(bankAccount);
                this.SaveChanges();
                return newBankAccount.Entity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public BankAccount Update(BankAccount bankAccount)
        {
            try
            {
                var updatedBankAccount = this.PasswordManagerDatabaseContext.BankAccounts.Update(bankAccount);
                this.SaveChanges();
                return updatedBankAccount.Entity;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Delete(int bankAccountId)
        {
            try
            {
                BankAccount? currentBankAccount = this.PasswordManagerDatabaseContext.BankAccounts?.FirstOrDefault(x => x.Id == bankAccountId);
                if (currentBankAccount is not null)
                {
                    this.PasswordManagerDatabaseContext.Remove(currentBankAccount);
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
