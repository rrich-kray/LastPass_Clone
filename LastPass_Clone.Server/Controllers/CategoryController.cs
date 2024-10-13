using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Types;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Utilities;
using System.Net;
using PasswordManager.Server.Services.JwtAuth;

namespace PasswordManager.Server.Controllers
{
    public class CategoryController : Controller
    {
        private CategoryRepository CategoryRepository { get; set; }
        private PasswordManagerDatabaseContext DatabaseContext { get; set; }
        public CategoryController(
            CategoryRepository passwordManagerRepository,
            PasswordManagerDatabaseContext databaseContext)
        {
            this.CategoryRepository = passwordManagerRepository;
            DatabaseContext = databaseContext;
        }

        [Route("/GetCategories")]
        [HttpGet]
        public IEnumerable<Category> GetCategories() => this.CategoryRepository.Categories;

        [Route("/GetCategoriesByUserId/{Id}")]
        [HttpGet]
        public IEnumerable<Category> GetCategoriesByUserId(string Id) =>
            this.CategoryRepository.Categories.Where(category => category.UserId.ToString().Equals(Id));

        [Route("/CreateCategory")]
        [HttpPost]
        public ControllerResponse<Category> CreateCategory([FromBody] Category category) =>
            ControllerUtils.CommonControllerCreate(
                validator: new CategoryEntityValidator(),
                validatee: category,
                repository: this.CategoryRepository,
                modelState: ModelState);

        [Route("/UpdateCategory")]
        [HttpPut]
        public ControllerResponse<Category> UpdateCategory([FromBody] Category category) =>
            ControllerUtils.CommonControllerUpdate(
                validator: new CategoryEntityValidator(),
                validatee: category,
                repository: this.CategoryRepository,
                modelState: ModelState);

        // This will have to be custom. When deleting a category, will have to move all items belonging to that category into another category, or remove the categoryID altogether
        [Route("/DeleteCategory/{categoryId}")]
        [HttpDelete]
        public ControllerResponse<Category> Delete(int categoryId)
        {
            ControllerResponse<Category> response = new ControllerResponse<Category>();
            try
            {
                // Find all items belonging to that category. Will have to use repositories for all types
                IEnumerable<PasswordInfo> passwords = this.DatabaseContext.Passwords.Where(password => password.CategoryId == categoryId);
                IEnumerable<Note> notes = this.DatabaseContext.Notes.Where(note => note.CategoryId == categoryId);
                IEnumerable<Address> addresses = this.DatabaseContext.Addresses.Where(address => address.CategoryId == categoryId);
                IEnumerable<BankAccount> bankAccounts = this.DatabaseContext.BankAccounts.Where(bankAccount => bankAccount.CategoryId == categoryId);
                IEnumerable<PaymentCard> paymentCards = this.DatabaseContext.PaymentCards.Where(paymentCard => paymentCard.CategoryId == categoryId);

                foreach (var password in passwords)
                {
                    password.CategoryId = null;
                    this.DatabaseContext.SaveChanges();
                }
                foreach (var note in notes)
                {
                    note.CategoryId = null;
                    this.DatabaseContext.SaveChanges();
                }
                foreach (var address in addresses)
                {
                    address.CategoryId = null;
                    this.DatabaseContext.SaveChanges();
                }
                foreach (var bankAccount in bankAccounts)
                {
                    bankAccount.CategoryId = null;
                    this.DatabaseContext.SaveChanges();
                }
                foreach (var paymentCard in paymentCards)
                {
                    paymentCard.CategoryId = null;
                    this.DatabaseContext.SaveChanges();
                }

                this.CategoryRepository.Delete(categoryId);
                this.CategoryRepository.SaveChanges();
                response.Success = true;
                response.Messages = new List<string> { "Category deletion successful." };
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Messages = new List<string> { ex.Message };
            }
            return response;
        }
    }
}
