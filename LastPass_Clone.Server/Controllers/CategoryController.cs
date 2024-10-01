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
        private PasswordRepository PasswordRepository { get; set; }
        private NoteRepository NoteRepository { get; set; }
        private AddressRepository AddressRepository { get; set; }
        private BankAccountRepository BankAccountRepository { get; set; }
        private PaymentCardRepository PaymentCardRepository { get; set; }
        public CategoryController(
            CategoryRepository passwordManagerRepository,
            PasswordRepository passwordRepository,
            NoteRepository noteRepository,
            BankAccountRepository bankAccountRepository,
            PaymentCardRepository paymentCardRepository,
            AddressRepository addressRepository)
        {
            this.CategoryRepository = passwordManagerRepository;
            this.PasswordRepository = passwordRepository;
            this.NoteRepository = noteRepository;
            this.BankAccountRepository = bankAccountRepository;
            this.PaymentCardRepository = paymentCardRepository;
            this.AddressRepository = addressRepository;
        }

        [Route("/GetCategories")]
        [HttpGet]
        public IEnumerable<Category> GetCategories() => this.CategoryRepository.Categories;

        [Route("/GetCategoriesByUserId")]
        [HttpGet]
        public IEnumerable<Category> GetCategoriesByUserId()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var decodedToken = new AuthService().Decode(token);
            return this.CategoryRepository.Categories.Where(category => category.UserId.ToString().Equals(decodedToken.Id));
        }

        [Route("/CreateCategory")]
        [HttpPost]
        public ControllerResponse<Category> CreateCategory([FromBody] Category category) =>
            ControllerUtils.CommonControllerCreate(
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
                IEnumerable<PasswordInfo> passwords = this.PasswordRepository.Passwords.Where(password => password.CategoryId == categoryId);
                IEnumerable<Note> notes = this.NoteRepository.Notes.Where(note => note.CategoryId == categoryId);
                IEnumerable<Address> addresses = this.AddressRepository.Addresses.Where(address => address.CategoryId == categoryId);
                IEnumerable<BankAccount> bankAccounts = this.BankAccountRepository.BankAccounts.Where(bankAccount => bankAccount.CategoryId == categoryId);
                IEnumerable<PaymentCard> paymentCards = this.PaymentCardRepository.PaymentCards.Where(paymentCard => paymentCard.CategoryId == categoryId);

                if (passwords.Any()) this.ChangeCategoryId<PasswordInfo>(passwords);
                if (notes.Any()) this.ChangeCategoryId<Note>(notes);
                if (addresses.Any()) this.ChangeCategoryId<Address>(addresses);
                if (bankAccounts.Any()) this.ChangeCategoryId<BankAccount>(bankAccounts);
                if (paymentCards.Any()) this.ChangeCategoryId<PaymentCard>(paymentCards);

                this.CategoryRepository.Delete(categoryId);
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

        public void ChangeCategoryId<T>(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                if (entity is not null)
                {
                    try
                    {
                        if (entity.GetType() == typeof(PasswordInfo)) this.PasswordRepository.Update(new PasswordInfo { Id = (entity as PasswordInfo).Id, CategoryId = null });
                        if (entity.GetType() == typeof(Note)) this.NoteRepository.Update(new Note { Id = (entity as Note).Id, CategoryId = null });
                        if (entity.GetType() == typeof(BankAccount)) this.BankAccountRepository.Update(new BankAccount { Id = (entity as BankAccount).Id, CategoryId = null });
                        if (entity.GetType() == typeof(Address)) this.AddressRepository.Update(new Address { Id = (entity as Address).Id, CategoryId = null });
                        if (entity.GetType() == typeof(PaymentCard)) this.PaymentCardRepository.Update(new PaymentCard { Id = (entity as PaymentCard).Id, CategoryId = null });
                    } catch (Exception ex)
                    {
                        throw new Exception(ex.Message);
                    }
                }
            }
        }
    }
}
