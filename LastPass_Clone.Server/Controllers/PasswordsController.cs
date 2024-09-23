using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Types;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Utilities;
using PasswordManager.Server.Data.DTOs;
using Microsoft.AspNetCore.Mvc.Filters;
using PasswordManager.Server.Services.JwtAuth;
using PasswordManager.Server.Services;

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

        [Route("/GetPasswordsByUserId")]
        [HttpGet]
        public IEnumerable<PasswordInfo> GetPasswordsByUserId()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var decodedToken = new AuthService().Decode(token);
            var userPasswords = this.PasswordRepository.Passwords.Where(password => password.UserId.ToString().Equals(decodedToken.Id));
            return userPasswords;
        }

        [Route("/GetPasswordsForCategory/{categoryId}")]
        [HttpGet]
        public IEnumerable<PasswordInfo> GetPasswordsForCategory(int categoryId) => this.PasswordRepository.GetPasswordsForCategory(categoryId);
        

        [Route("/CreatePassword")]
        [HttpPost]
        public IResult CreatePassword([FromBody] PasswordInfo passwordInfo)
        {
            return ControllerUtils.CommonControllerCreate(
                validator: new PasswordEntityValidator(),
                validatee: passwordInfo,
                repository: this.PasswordRepository, 
                modelState: ModelState);
        }
            
        [Route("/UpdatePassword")]
        [HttpPut]
        public IResult UpdatePassword([FromBody] PasswordInfo passwordInfo)
        {
            return ControllerUtils.CommonControllerUpdate(
                validator: new PasswordEntityValidator(),
                validatee: passwordInfo,
                repository: this.PasswordRepository, 
                modelState: ModelState);
        }

        [Route("/DeletePassword/{passwordId}")]
        [HttpDelete]
        public IResult DeletePassword(int passwordId) =>
            ControllerUtils.CommonControllerDelete<PasswordInfo>(
                this.PasswordRepository, 
                passwordId, 
                "Password Deletion Successful.");
    }
}
