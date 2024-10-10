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
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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
        private IHostEnvironment _hostEnvironment { get; set; }
        private readonly ILogger _logger;

        public UserController(
            UserRepository userRepository, 
            CategoryRepository categoryRepository, 
            PasswordResetCodeRepository passwordResetCodeRepository, 
            ILogger<UserController> logger,
            IHostEnvironment hostEnvironment)
        {
            this.UserRepository = userRepository;
            this.CategoryRepository = categoryRepository;
            this.PasswordResetCodeRepository = passwordResetCodeRepository;
            this._logger = logger;
            this._hostEnvironment = hostEnvironment;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/Login")]
        public async Task<IResult> Login([FromBody] LoginReq loginReq)
        {
            // look up user in database by email, check password, if 
            var user = this.UserRepository.Users.FirstOrDefault(x => x.Email == loginReq.Email);
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
            var doesEmailExist = this.UserRepository.Users.FirstOrDefault(x => x.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase)) is not null;
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

        // reset code table will eventually become too large for any meaningful application. This solution is not scalable. 
        // Remove the code from the DB when it is used? Or remove when expired, and just check for that in the code?
        [AllowAnonymous]
        [HttpPost]
        [Route("/ResetPassword/{email}")]
        public AuthenticationResponse ResetPassword(string email)
        {
            AuthenticationResponse response = new AuthenticationResponse();

            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()) // CurrentDirectory is root of application's folder
                .AddJsonFile("secrets.json")
                .Build();

            var passwordResetSenderEmail = configuration.GetSection("PasswordResetSenderEmail").Value;
            var passwordResetSenderEmailGoogleAppPassword = configuration.GetSection("PasswordResetSenderEmailAppPassword").Value;

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

            // Generate Cryptographically secure random number for reset key
            var hmac = new HMACSHA256();
            var key = Convert.ToBase64String(hmac.Key).Replace("/", "?").Replace("\\", "?"); // Is it still cryptographically secure if some characters are replaced? Do I even need cryptographic security?

            // Save key to database with User Id
            this.PasswordResetCodeRepository.Create(new PasswordResetCode { UserId = user.Id, Code = key, Expiration = DateTime.Now.AddMinutes(30)});

            // Connect client
            var client = new SmtpClient(new ProtocolLogger("smtp.log"));
            client.ServerCertificateValidationCallback = (s, c, h, e) => true;
            client.Connect("smtp.gmail.com", 465, SecureSocketOptions.SslOnConnect);
            if (!client.IsConnected)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Client could not connect to the SMTP server." };
                return response;
            }

            // Authenticate client
            client.Authenticate(passwordResetSenderEmail, passwordResetSenderEmailGoogleAppPassword);
            if (!client.IsAuthenticated)
            {
                response.Result = false;
                response.Messages = new List<string>() { "Could not authenticate the sender." };
                return response;
            }

            // Create message
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Password Manager", passwordResetSenderEmail));
            message.To.Add(new MailboxAddress("User", email));
            message.Subject = "PasswordManager Password Recovery";
            string resetLink = this._hostEnvironment.IsDevelopment() ? $"https://localhost:5173" : "https://passwordmanager1.azurewebsites.net";
            message.Body = new TextPart("Plain")
            {
                Text = $@"This user requested a password reset. If this is a mistake, please ignore this email
.
                        If this is the intended recipient, please follow the link below to reset your password.
                        {resetLink}/UpdatePassword/{key}"
            };

            client.Send(message);
            client.Disconnect(true);
            client.Dispose();

            response.Result = true;
            response.Messages = new List<string>() { "Password recovery email successfully sent." };
            return response;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("/VerifyPasswordReset/{guid}")]
        public AuthenticationResponse VerifyPasswordReset(string guid)
        {
            var response = new AuthenticationResponse();

            // Find password reset code in database
            var passwordResetCode = this.PasswordResetCodeRepository.passwordResetCodes.FirstOrDefault(code => code.Code.ToString().Equals(guid, StringComparison.OrdinalIgnoreCase));
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

            // Will implement a delete user feature in the future. What if user deletes account right after asking for a reset code? Highky unlikely, as there would be no reason to request a reset code when they have access to their account, why throwing an exception here may not be ideal.
            // Could delete the code if the user logs in 
            User? user = this.UserRepository.Users.FirstOrDefault(user => user.Id == code.UserId);
            if (user is null)
            {
                response.Result = false;
                response.Messages = new List<string>() { "User not found. It is likely that the user deleted their account after initializing the password reset." };
                return response;
            }

            if (updatePasswordRequest.Password.Equals(user.Password))
            {
                response.Result = false;
                response.Messages = new List<string>() { "Password cannot be the same as the existing password."};
                return response;
            }
            user.Password = updatePasswordRequest.Password;
            this.UserRepository.SaveChanges();


            // Delete the reset code
            // Should I delete here
            // Should I write a service that periodically deletes expired reset codes to ensure the table does not grow too large?
            this.PasswordResetCodeRepository.Delete(code.Id);
            this.PasswordResetCodeRepository.SaveChanges();

            response.Result = true;
            response.Messages = new List<string>() { "User password successfully updated." };

            return response;
        }
    }
}
