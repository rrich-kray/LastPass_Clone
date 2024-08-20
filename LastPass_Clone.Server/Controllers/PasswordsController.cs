using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Types;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Utilities;

namespace PasswordManager.Server.Controllers
{
    
    [Route("/Passwords")]
    public class PasswordsController : Controller
    {
        private PasswordRepository PasswordRepository { get; set; }

        public PasswordsController(PasswordRepository passwordManagerRepository)
        {
            this.PasswordRepository = passwordManagerRepository;
        }

        [Route("/GetAllPasswords")]
        [HttpGet]
        public IEnumerable<PasswordInfo> GetAllPasswords() => this.PasswordRepository.Passwords;

        [Route("/GetPasswordsForCategory/{categoryId}")]
        [HttpGet]
        public IEnumerable<PasswordInfo> GetPasswordsForCategory(int categoryId) => this.PasswordRepository.GetPasswordsForCategory(categoryId);

        [Route("/CreatePassword")]
        [HttpPost]
        public Response CreatePassword([FromBody] PasswordInfo passwordInfo) =>
            ControllerUtils.CommonControllerCreate(
                validator: new PasswordEntityValidator(),
                validatee: passwordInfo,
                repository: this.PasswordRepository);

        [Route("/UpdatePassword")]
        [HttpPut]
        public Response UpdatePassword([FromBody] PasswordInfo password) =>
            ControllerUtils.CommonControllerUpdate(
                validator: new PasswordEntityValidator(),
                validatee: password,
                repository: this.PasswordRepository);

        [Route("/DeletePassword/{passwordId}")]
        [HttpDelete]
        public Response DeletePassword(int passwordId) =>
            ControllerUtils.CommonControllerDelete<PasswordInfo>(
                this.PasswordRepository, 
                passwordId, 
                "Password Deletion Successful.");
    }
}
