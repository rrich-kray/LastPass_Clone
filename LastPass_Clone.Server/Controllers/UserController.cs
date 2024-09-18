using PasswordManager.Server.Data.Repositories;

namespace PasswordManager.Server.Controllers
{
    public class UserController
    {
        private  AddressRepository { get; set; }

        public AddressController(AddressRepository passwordManagerRepository)
        {
            this.AddressRepository = passwordManagerRepository;
        }
    }
}
