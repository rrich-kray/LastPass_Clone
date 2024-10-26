using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Services.JwtAuth;
using PasswordManager.Server.Services;
using MailKit.Net.Smtp;
using MailKit;
using MimeKit;
using MailKit.Security;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Text;
using System.Web.Helpers;
using PasswordManager.Server.Types;
using Org.BouncyCastle.Bcpg;

namespace PasswordManager.Server.Controllers
{
    public class UserController : Controller
    {

        private UserRepository UserRepository { get; set; }
        private PasswordResetCodeRepository PasswordResetCodeRepository { get; set; }
        private CategoryRepository CategoryRepository { get; set; }
        private AccountVerificationCodeRepository AccountVerificationCodeRepository { get; set; }
        private string BaseUrl { get; set; }
        private IHostEnvironment _hostEnvironment { get; set; }
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        public UserController(
            UserRepository userRepository, 
            CategoryRepository categoryRepository, 
            PasswordResetCodeRepository passwordResetCodeRepository, 
            ILogger<UserController> logger,
            IHostEnvironment hostEnvironment,
            IConfiguration configuration,
            AccountVerificationCodeRepository accountVerificationCodeRepository)
        {
            this.UserRepository = userRepository;
            this.CategoryRepository = categoryRepository;
            this.PasswordResetCodeRepository = passwordResetCodeRepository;
            this._logger = logger;
            this._hostEnvironment = hostEnvironment;
            this._configuration = configuration;
            this.AccountVerificationCodeRepository = accountVerificationCodeRepository;
            this.BaseUrl = this._hostEnvironment.IsDevelopment() ? $"https://localhost:5173" : "https://passwordmanager1.azurewebsites.net";
        }

        public class LoginReq
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public string GenerateKey()
        {
            StringBuilder sb = new StringBuilder();
            var matchValues = Regex.Matches(Convert.ToBase64String(RandomNumberGenerator.GetBytes(24)), @"[a-zA-Z0-9]").Select(match => match.Value);
            foreach (var matchValue in matchValues) sb.Append(matchValue);
            return sb.ToString();
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/Login")]
        public IResult Login([FromBody] LoginReq loginReq)
        {
            var user = this.UserRepository.Users.FirstOrDefault(x => x.Email == loginReq.Email);
            if (user is null)
                return Results.Json(new AuthenticationResponse { Result = false, Messages = new List<string>() { "User with email was not found." } });
            if (!Crypto.VerifyHashedPassword(user.Password, loginReq.Password))
                return Results.Json(new AuthenticationResponse { Result = false, Messages = new List<string>() { "Invalid credentials provided." } });
            string token = new AuthService().Create(user);
            return Results.Json(new AuthenticationResponse { User = user, Result = true, Token = token, Messages = new List<string>() { "Log in successful." } });
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/Register")]
        public AuthenticationResponse Register([FromBody] User user)
        {
            AuthenticationResponse response = new AuthenticationResponse();
            var doesEmailExist = this.UserRepository.Users.FirstOrDefault(x => x.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase)) is not null;
            if (doesEmailExist)
            {
                return new AuthenticationResponse { Result = false, Messages = new List<string>() { "The provided email already exists for another user." } };
            }

            if (new VerificationService().VerifyPassword(user.Password, 8) == false)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Invalid password provided. Passwords must contain at least one uppercase letter, one number and be at least eight characters in length." };
                return response;
            }

            var newUser = this.UserRepository.Create(
                new User
                {
                    Email = user.Email,
                    Password = Crypto.HashPassword(user.Password),
                    FirstName = user.FirstName,
                    MiddleName = user.MiddleName,
                    LastName = user.LastName,
                    Roles = user.Roles,
                });

            string key = this.GenerateKey();

            // need to create an AccountVerificationCode
            this.AccountVerificationCodeRepository.Create(new AccountVerificationCode { UserId = newUser.Id, Key = key, ExpirationDate =  DateTime.Now.AddMinutes(30), SendDate = DateTime.Now});
            this.AccountVerificationCodeRepository.SaveChanges();

            EmailService emailService = new EmailService();
            emailService.SendEmail(
                response,
                user.Email,
                @$"If this is the intended recipient, please follow the link below to confirm your account. If not, please disregard this email.
                  https://{this.BaseUrl}/ConfirmAccount/{this.GenerateKey()}");

            this.CreateDefaultUserCategories(newUser);
            string token = new AuthService().Create(newUser);

            response.Result = true;
            response.Token = token;
            // response.User = newUser; // Remove this WTF, don't send password back to client
            response.Messages = new List<string>() { "Account creation successful." };
            return response;
        }

        [HttpGet]
        [Route("/VerifyToken")]
        public AuthenticationResponse VerifyToken()
        {
            return new AuthenticationResponse { Result = true, Messages = new List<string>() { "This route is guarded. If this request succeeded, the user possesses a valid JWT." } };
        }

        [HttpGet]
        [Route("/GetUserData")]
        public AuthenticationResponse GetUserDataFromToken()
        {
            AuthenticationResponse response = new AuthenticationResponse();
            var token = HttpContext.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var decodedToken = new AuthService().Decode(token);
            var user = this.UserRepository.Users.FirstOrDefault(x => x.Id.ToString() == decodedToken.Id);
            if (user is null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "User not found." };
                return response;
            }
            response.Result = true;
            response.Messages = new List<string>() { "User data retrieval successful." };
            response.User = new User
            {
                Id = user.Id,
                Email = user.Email,
                Password = user.Password, // REMOVE THIS WTF
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                Roles = user.Roles,
            };
            return response;
        }

        private void CreateDefaultUserCategories(User user)
        {
            List<string> categoryNames = new List<string> { "Business", "Arts", "Productivity Tools", "Shopping", "Email", "Social", "Entertainment" };
            List<Category> createdCategories = new List<Category>();
            foreach (string categoryName in categoryNames)
                this.CategoryRepository.Create(new Category { UserId = user.Id, Name = categoryName });
        }

        // reset code table will eventually become too large for any meaningful application. This solution is not scalable. 
        // Remove the code from the DB when it is used? Or remove when expired, and just check for that in the code?
        [AllowAnonymous]
        [HttpPost]
        [Route("/ResetPassword/{email}")]
        public AuthenticationResponse ResetPassword(string email)
        {
            AuthenticationResponse response = new AuthenticationResponse();

            // check if email exists in the database
            var user = this.UserRepository.Users.FirstOrDefault(user => user.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            if (user is null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Could not find a user associated with the provided email." };
                return response;
            }

            var doesUserHaveOutstandingResetCode = this.PasswordResetCodeRepository.passwordResetCodes.FirstOrDefault(code => code.UserId == user.Id && code.Expiration > DateTime.Now);

            // Commented out for debugging
            if (doesUserHaveOutstandingResetCode != null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "The user with this email already has an outstanding reset code. Please check your email again for the code." };
                return response;
            }

            string key = this.GenerateKey();

            // Save key to database with User Id
            this.PasswordResetCodeRepository.Create(
                new PasswordResetCode 
                { 
                    UserId = user.Id, 
                    Code = key, 
                    Expiration = DateTime.Now.AddMinutes(30)
                });

            EmailService emailService = new EmailService();
            return emailService.SendEmail(
                response,
                email,
                $@"This user requested a password reset. If this is a mistake, please ignore this email
.
                        If this is the intended recipient, please follow the link below to reset your password.
                        {this.BaseUrl}/UpdatePassword/{key}");
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("/VerifyPasswordReset/{key}")]
        public AuthenticationResponse VerifyPasswordReset(string key)
        {
            var response = new AuthenticationResponse();

            // Find password reset code in database
            var passwordResetCode = this.PasswordResetCodeRepository.passwordResetCodes.FirstOrDefault(code => code.Code.Equals(key, StringComparison.OrdinalIgnoreCase));
            if (passwordResetCode is null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "This code has already been used." };
                return response;
            }
            if (passwordResetCode!.Expiration < DateTime.Now)
            {
                response.Result = false;
                response.Messages = new List<string>() { "The provided password Reset Code is expired. Please navigate to the Reset Password page if you need another." };
                return response;
            }

            response.Result = true;
            response.Messages = new List<string>() { "Password Reset Code is valid." };
            return response;
        }

        public class UpdatePasswordRequest
        {
            public string Password { get; set; }
            public string Guid { get; set; }
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("/ChangePassword")]
        public AuthenticationResponse ChangePassword([FromBody] UpdatePasswordRequest updatePasswordRequest)
        {
            AuthenticationResponse response = new AuthenticationResponse();
            if (new VerificationService().VerifyPassword(updatePasswordRequest.Password, 8) == false)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Invalid password provided. Passwords must contain at least one uppercase letter, one number and be at least eight characters in length." };
                return response;
            }
            // Throwing an exception here would not be ideal, as this is expected to happen
            PasswordResetCode? code = this.PasswordResetCodeRepository.passwordResetCodes.FirstOrDefault(code => code.Code.ToString().Equals(updatePasswordRequest.Guid, StringComparison.OrdinalIgnoreCase));

            // This may warrant an exception. This error is not expected to occur. But what if I decide to implement a service that deletes codes x amount of time after expiration?
            if (code is null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "A reset code was not found for the specified user." };
                return response;
            }

            // Should I delete code here?
            if (code.Expiration < DateTime.Now)
            {
                response.Result = false;
                response.Messages = new List<string>() { "The reset code has expired." };
                return response;
            }

            // Will implement a delete user feature in the future. What if user deletes account right after asking for a reset code? Highly unlikely, as there would be no reason to request a reset code when they have access to their account, why throwing an exception here may not be ideal.
            // Could delete the code if the user logs in 
            User? user = this.UserRepository.Users.FirstOrDefault(user => user.Id == code.UserId);
            if (user is null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "User not found. It is likely that the user deleted their account after initializing the password reset." };
                return response;
            }

            if (Crypto.VerifyHashedPassword(user.Password, updatePasswordRequest.Password))
            {
                response.Result = false;
                response.Messages = new List<string>() { "Password cannot be the same as the existing password."};
                return response;
            }
            user.Password = Crypto.HashPassword(updatePasswordRequest.Password);
            this.UserRepository.SaveChanges();

            // Delete the reset code
            // Should I delete here
            // Should I write a service that periodically deletes expired reset codes to ensure the table does not grow too large?
            // Will have to write a migration that updates all of the current passwords in teh database with hashes
            this.PasswordResetCodeRepository.Delete(code.Id);
            this.PasswordResetCodeRepository.SaveChanges();

            response.Result = true;
            response.Messages = new List<string>() { "User password successfully updated." };

            return response;
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("/ConfirmAcount/{key}")]
        public AuthenticationResponse VerifyAccount(string key)
        {
            // Look up key in database, if it is not expired, set isAccountVerified switch on user to true
            var response = new AuthenticationResponse();

            // Will select the most recently sent code
            var verificationCode = this.AccountVerificationCodeRepository.AccountVerificationCodes
                .OrderByDescending(x => x.SendDate)
                .FirstOrDefault(code => code.Key.Equals(key, StringComparison.OrdinalIgnoreCase));

            if (verificationCode == null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Verification code not found in database." };
                return response;
            }
            if (DateTime.Now > verificationCode.ExpirationDate)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Verification code has expired, please request another one." };
                return response;
            }

            var user = this.UserRepository.Users.FirstOrDefault(user => user.Id == verificationCode.UserId);
            if (user is null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "No user associated with the account verification code was found." };
                return response;
            }

            user.IsAccountVerified = true;
            this.UserRepository.SaveChanges();

            response.Result = true;
            response.Messages = new List<string>() { "Password Reset Code is valid." };
            return response;
        }

        [AllowAnonymous]
        [HttpPut]
        [Route("/ResendConfirmationEmail/{email}/{userId}")]
        public AuthenticationResponse ResendConfirmationEmail(string email, int userId)
        {
            AuthenticationResponse response = new AuthenticationResponse();
            // Create an account verification code string
            string key = this.GenerateKey();

            // create a new AccountVerificationCode
            this.AccountVerificationCodeRepository.Create(
                new AccountVerificationCode 
                { 
                    UserId = userId, 
                    Key = key, 
                    SendDate = DateTime.Now, 
                    ExpirationDate = DateTime.Now.AddMinutes(30) 
                });

            EmailService emailService = new EmailService();
            return emailService.SendEmail(
                response,
                email,
                @$"If this is the intended recipient, please follow the link below to confirm your account. If not, please disregard this email.
                  https://{this.BaseUrl}/ConfirmAccount/{key}");

        }
    }
}


// Process
// User registers, hits /Register, gets email, is logged in (i.e. has token in localstorage).
// App.tsx will use this to get User info. User info will have IsAccountVerified = false until link is clicked. Guards will use user info from App.tsx to check if user is verified, if not, will redirect to ConfirmAccount page. So refreshing after registering will yield this page.
// Email takes user to /ConfirmAccount/{key}, this opens ConfirmAccount page on frontend. This will use /ConfirmAccount/{key} route in useEffect to confirm key 

// Frontend
// After registering, user will get token, 
// AcessLoginRegister can house logic that presents user with page telling user to check email for verification code, or get another one, if user.isAccountVerified = false