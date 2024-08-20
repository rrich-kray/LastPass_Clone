using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Data.Entities;

namespace PasswordManager.Server.Data.Repositories
{
    public class CategoryRepository : IPasswordManagerRepository<Category>
    {
        public PasswordManagerDatabaseContext PasswordManagerDatabaseContext { get; set; }
        public CategoryRepository(PasswordManagerDatabaseContext passwordManagerDatabaseContext)
        {
            this.PasswordManagerDatabaseContext = passwordManagerDatabaseContext;
        }

        public IEnumerable<Category> Categories => this.PasswordManagerDatabaseContext.Categories;

        public void Create(Category category)
        {
            try
            {
                PasswordManagerDatabaseContext.Add(category);
            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message}");
            }
        }

        public void Update(Category category)
        {
            try
            {
                var currentCategory = this.PasswordManagerDatabaseContext.Categories.Update(category);
                this.SaveChanges();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public void Delete(int categoryId)
        {
            try
            {
                var existingCategory = this.PasswordManagerDatabaseContext.Categories.FirstOrDefault(x => x.Id == categoryId);
                this.PasswordManagerDatabaseContext.Categories.Remove(existingCategory);
            }
            catch (Exception ex)
            {
                throw new Exception($"{ex.Message}");
            }
        }

        public void SaveChanges() => this.PasswordManagerDatabaseContext.SaveChanges();
    }
}
