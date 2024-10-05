using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Services.JwtAuth;
using PasswordManager.Server.Services;
using PasswordManager.Server.Utilities;
using static PasswordManager.Server.Controllers.UserController;
using MailKit.Net.Smtp;
using MailKit;
using MimeKit;
using Microsoft.Extensions.Azure;
using MailKit.Security;

namespace PasswordManager.Server.Controllers
{
    public class UserController : Controller
    {
        public class LoginReq
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class AuthenticationResponse
        {
            public User? User { get; set; }
            public bool? Result { get; set; }
            public string? Token { get; set; }
            public List<string>? Messages { get; set; }
        }
        private UserRepository UserRepository { get; set; }
        private PasswordResetCodeRepository PasswordResetCodeRepository { get; set; }
        private CategoryRepository CategoryRepository { get; set; }

        public UserController(UserRepository userRepository, CategoryRepository categoryRepository, PasswordResetCodeRepository passwordResetCodeRepository)
        {
            this.UserRepository = userRepository;
            this.CategoryRepository = categoryRepository;
            this.PasswordResetCodeRepository = passwordResetCodeRepository;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/Login")]
        public async Task<IResult> Login([FromBody] LoginReq loginReq)
        {
            // look up user in database by email, check password, if 
            var user = this.UserRepository.User.FirstOrDefault(x => x.Email == loginReq.Email);
            if (user is null)
                return Results.Json(new AuthenticationResponse { Result = false, Messages = new List<string>() { "User with email was not found." } });
            if (user.Password != loginReq.Password)
                return Results.Json(new AuthenticationResponse { Result = false, Messages = new List<string>() { "Invalid credentials provided." } });
            string token = new AuthService().Create(user);
            return Results.Json(new AuthenticationResponse { User = user, Result = true, Token = token, Messages = new List<string>() { "Log in successful." } });
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/Register")]
        public async Task<AuthenticationResponse> Register([FromBody] User user)
        {
            AuthenticationResponse response = new AuthenticationResponse();
            var doesEmailExist = this.UserRepository.User.FirstOrDefault(x => x.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase)) is not null;
            if (doesEmailExist)
            {
                return new AuthenticationResponse { Result = false, Messages = new List<string>() { "The provided email already exists for another user." } };
            }

            if (new VerificationService().VerifyPassword(user.Password, 8) == false)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Invalid password provided. Passwords must contain at least one uppercase letter, one number and be at least eight characters in length."};
                return response;
            }

            var newUser = this.UserRepository.Create(
                new User
            {
                Email = user.Email,
                Password = user.Password,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                Roles = user.Roles,
            });

            this.CreateDefaultUserCategories(newUser);
            string token = new AuthService().Create(newUser);

            response.Result = true;
            response.Token = token;
            response.User = newUser;
            response.Messages = new List<string>() { "Account creation successful." };
            return response;
        }

        [HttpGet]
        [Route("/VerifyToken")]
        public async Task<AuthenticationResponse> VerifyToken()
        {
            return new AuthenticationResponse { Result = true, Messages = new List<string>() { "This route is guarded. If this request succeeded, the user possesses a valid JWT." } };
        }

        [HttpGet]
        [Route("/GetUserData")]
        public async Task<AuthenticationResponse> GetUserDataFromToken()
        {
            AuthenticationResponse response = new AuthenticationResponse();
            var token = HttpContext.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var decodedToken = new AuthService().Decode(token);
            var user = this.UserRepository.User.FirstOrDefault(x => x.Id.ToString() == decodedToken.Id);
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
                Password = user.Password,
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

        [AllowAnonymous]
        [HttpPost]
        [Route("/ResetPassword")]
        public async Task<AuthenticationResponse> ResetPassword([FromBody] string email)
        {
            AuthenticationResponse response = new AuthenticationResponse();

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()) // CurrentDirectory must be root of application's folder
                .AddJsonFile("secrets.json")
                .Build();

            // check if email exists in the database
            var user = this.UserRepository.User.FirstOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
            if (user is not null)
            {
                var doesUserHaveOutstandingResetCode = this.PasswordResetCodeRepository.passwordResetCodes.FirstOrDefault(code => code.UserId == user.Id && code.Expiration > DateTime.Now);
                if (doesUserHaveOutstandingResetCode != null)
                {
                    response.Result = false;
                    response.Messages = new List<string>() { "The user with this email already has an outstanding reset code. Please check your email again for the code." };
                    return response;
                }
                // Generate guid
                var guid = Guid.NewGuid();

                // Save GUID to database with User Id
                try
                {
                    this.PasswordResetCodeRepository.Create(new PasswordResetCode { UserId = user.Id, Code = guid, Expiration = DateTime.Now.AddMinutes(30)});
                } catch (Exception ex)
                {
                    response.Result = false;
                    response.Messages = new List<string>() { "Error saving Password Reset Code entity to database. See exception in next message", ex.Message };
                    return response;
                }

                // Connect client
                var client = new SmtpClient();
                try
                {
                    await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.Auto);
                    await client.AuthenticateAsync(configuration.GetSection("PasswordResetSenderEmail").Value, configuration.GetSection("PasswordResetSenderEmailAppPassword").Value);
                } catch (Exception ex)
                {
                    response.Result = false;
                    response.Messages = new List<string>() { "Error connecting to Gmail SMTP server or authenticating user, see the following exception.", ex.Message };
                    return response;
                }

                // Create message
                try
                {
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("Password Manager", configuration.GetSection("PasswordResetSenderEmail").Value));
                    message.To.Add(new MailboxAddress("User", email));
                    message.Subject = "PasswordManager Password Recovery";
                    message.Body = new TextPart("Plain")
                    {
                        Text = $@"This user requested a password reset. If this is a mistake, please ignore this email.
                                If this is the intended recipient, please follow the link below to reset your password.
                                https://passwordmanager1.azurewebsites.net/VerifyPasswordReset/{guid}"
                    };
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                } catch (Exception ex)
                {
                    response.Result = false;
                    response.Messages = new List<string>() { "Error creating message, see following exception. See exception in next message", ex.Message };
                    return response;
                }
            }

            response.Result = true;
            response.Messages = new List<string>() { "Password recovery email successfully sent." };
            return response;
        }

        [HttpGet]
        [Route("/VerifyPasswordReset")]
        public async Task<AuthenticationResponse> VerifyPasswordReset(string guid)
        {
            var response = new AuthenticationResponse();
            // Find password reset code in database
            var passwordResetCode = this.PasswordResetCodeRepository.passwordResetCodes.FirstOrDefault(code => code.Code.ToString().Equals(guid, StringComparison.OrdinalIgnoreCase));
            if (passwordResetCode is null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "User does not have a password reset code." };
                return response;
            }
            if (passwordResetCode!.Expiration < DateTime.Now)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Password Reset Code is expired." };
                return response;
            }

            response.Result = true;
            response.Messages = new List<string>() { "Password Reset Code is valid." };
            return response;
        }

        [HttpPost]
        [Route("/UpdatePassword/{userId}")]
        public async Task<AuthenticationResponse> UpdatePassword([FromBody] string newPassword, int userId)
        {
            AuthenticationResponse response = new AuthenticationResponse();
            User? user = this.UserRepository.User.FirstOrDefault(user => user.Id == userId);
            if (user == null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "User not found." };
                return response;
            }

            try
            {
                user.Password = newPassword;
                this.UserRepository.SaveChanges();
                response.Result = true;
                response.Messages = new List<string>() { "User password successfully updated." };

            } catch (Exception ex)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Error updating the user's password, see following exception.", ex.Message };
            }

            return response;
        }
    }
}
