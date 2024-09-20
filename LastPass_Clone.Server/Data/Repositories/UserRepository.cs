using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;

namespace PasswordManager.Server.Data.Repositories
{
    public class UserRepository: IPasswordManagerRepository<User>
    {
        public PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; set; }
        public UserRepository(PasswordManagerDatabaseContext passwordManagerDatabaseContext)
        {
            this.PasswordManagerDatabaseContext = passwordManagerDatabaseContext;
        }

        public IEnumerable<User> User => this.PasswordManagerDatabaseContext.Users;

        public User Create(User user)
        {
            try
            {
                var newUser = this.PasswordManagerDatabaseContext.Users.Add(user);
                this.SaveChanges();
                return newUser.Entity;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public User Update(User user)
        {
            try
            {
                var updatedUser = this.PasswordManagerDatabaseContext.Users.Update(user);
                this.SaveChanges();
                return updatedUser.Entity;

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Delete(int userId)
        {
            try
            {
                User? currentUser = this.PasswordManagerDatabaseContext.Users?.FirstOrDefault(x => x.Id == userId);
                if (currentUser is not null)
                {
                    this.PasswordManagerDatabaseContext.Remove(currentUser);
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
