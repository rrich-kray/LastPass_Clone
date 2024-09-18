using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Types;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Utilities;
using PasswordManager.Server.Data.DTOs;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Identity;
using PasswordManager.Server.Services;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;

namespace PasswordManager.Server.Controllers
{
    public class UserController : Controller
    {
        SignInManager<User> SignInManager;
        UserManager<User> UserManager;
        Microsoft.AspNetCore.Identity.UI.Services.IEmailSender EmailSender;
        private PasswordRepository PasswordRepository { get; set; }

        public UserController(
            PasswordRepository passwordManagerRepository, 
            UserManager<User> userManager, 
            SignInManager<User> signInManager)
        {
            this.PasswordRepository = passwordManagerRepository;
            this.UserManager = userManager;
            this.SignInManager = signInManager;
            this.EmailSender = emailSender;
        }

        public class AuthenticationResult
        {
            public User? User { get; set; }
            public bool Result { get; set; }
            public string? Token { get; set; }
            public IEnumerable<string> Messages { get; set; }
        }

        [Route("/Users/Register")]
        [HttpPost]
        public async Task<IResult> Register([FromBody] User user, string password)
        {
            IResult response;
            // if (!ModelState.IsValid) return ModelBindingErrorLogger.LogErrorMessages(ModelState, response);
            var applicationUser = new User
            {
                Email = user.Email,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName
            };
            var result = await this.UserManager.CreateAsync(applicationUser, password);
            if (result.Succeeded)
            {
                // Comment the below to require email confirmation prior to logging in
                await SignInManager.SignInAsync(user, isPersistent: false);

                // Generate token
                var token = await this.UserManager.GenerateUserTokenAsync(applicationUser, "Authenticator", "Authenticator");
                return Results.Json(new AuthenticationResult { User = applicationUser, Result = true, Token = token, Messages = new List<string> { "Account creation successful" } });
            } else
            {
                var errors = new List<string>();
                foreach (var error in result.Errors) errors.Add(error.Description);
                return Results.Json(new AuthenticationResult { Result = false, Messages = errors});
            }
        }

        [Route("/Users/Login")]
        [HttpPost]
        public async Task<IResult> Login(string email, string password, bool rememberMe)
        {
            //if (!ModelState.IsValid) return ModelBindingErrorLogger.LogErrorMessages(ModelState, response);
            var user = await UserManager.FindByNameAsync(email);

            if (user != null)
            {
                /*
                if (!await UserManager.IsEmailConfirmedAsync(user))
                {
                    response.Result = false;
                    response.Message = new List<string> { "Email must be confirmed prior to logging in." };
                }
                */

                var result = await SignInManager.PasswordSignInAsync(
                    userName: email, 
                    password: password, 
                    isPersistent: rememberMe, 
                    lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    var token = await this.UserManager.GenerateUserTokenAsync(user, "Authenticator", "Authenticator");
                    return Results.Json(new AuthenticationResult { User = user, Result = true, Token = token, Messages = new List<string> {"Authentication successful"} });
                } else if (result.IsLockedOut)
                {
                    return Results.Json(new AuthenticationResult { Result = true, Messages = new List<string> { "User is currently locked out of their account." } });
                } else if (result.IsNotAllowed)
                {
                    return Results.Json(new AuthenticationResult { Result = true, Messages = new List<string> { "User is not permitted to login to this account." } });
                } else
                {
                    return Results.Json(new AuthenticationResult { Result = true, Messages = new List<string> { "Invalid credentials provided." } });
                }
            }
            return Results.Json(new AuthenticationResult { Result = true, Messages = new List<string> { "Invalid credentials provided." } });
        }

        public async Task<IResult> VerifyToken([FromBody] User user, string token)
        {
            var result = UserManager.VerifyUserTokenAsync(user, "Authenticator", "Authenticator", token);
            if (result.IsCompletedSuccessfully)
            {
                return Results.Json(new AuthenticationResult { Result = true, Messages = new List<string> { "Token has been verified" } });
            } else if (result.IsCanceled)
            {
                return Results.Json(new AuthenticationResult { Result = false, Messages = new List<string> { "Verification request wsa unexpectadly cancelled." } });
            } else
            {
                return Results.Json(new AuthenticationResult { Result = false, Messages = new List<string> { "Verification encountered an unexpected error." } });
            }
        }
    }
}
