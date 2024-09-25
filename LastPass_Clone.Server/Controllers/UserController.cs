﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Services.JwtAuth;
using static PasswordManager.Server.Controllers.UserController;

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
            public User User { get; set; }
            public bool? Result { get; set; }
            public string? Token { get; set; }
            public string? Message { get; set; }
        }
        private UserRepository UserRepository { get; set; }
        private CategoryRepository CategoryRepository { get; set; }

        public UserController(UserRepository userRepository, CategoryRepository categoryRepository)
        {
            this.UserRepository = userRepository;
            this.CategoryRepository = categoryRepository;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/Login")]
        public async Task<IResult> Login([FromBody] LoginReq loginReq)
        {
            // look up user in database by email, check password, if 
            var user = this.UserRepository.User.FirstOrDefault(x => x.Email == loginReq.Email);
            if (user is null)
                return Results.Json(new AuthenticationResponse { Result = false, Message = "User with email was not found." });
            if (user.Password != loginReq.Password)
                return Results.Json(new AuthenticationResponse { Result = false, Message = "Invalid credentials provided." });
            string token = new AuthService().Create(user);
            return Results.Json(new AuthenticationResponse { User = user, Result = true, Token = token, Message = "Log in successful." });
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("/Register")]
        public async Task<IResult> Register([FromBody] User user)
        {
            var doesEmailExist = this.UserRepository.User.FirstOrDefault(x => x.Email.Equals(user.Email, StringComparison.OrdinalIgnoreCase)) is not null;
            if (doesEmailExist)
            {
                return Results.Json(new AuthenticationResponse { Result = false, Message = "The provided email already exists for another user." });
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
            return Results.Json(new AuthenticationResponse { User = newUser, Result = true, Token = token, Message = "Account creation successful." });
        }

        [HttpGet]
        [Route("/VerifyToken")]
        public async Task<IResult> VerifyToken()
        {
            return Results.Json(new AuthenticationResponse { Result = true, Message = "This route is guarded. If this request succeeded, the user possesses a valid JWT."});
        }

        [HttpGet]
        [Route("/GetUserData")]
        public async Task<IResult> GetUserDataFromToken()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var decodedToken = new AuthService().Decode(token);
            var user = this.UserRepository.User.FirstOrDefault(x => x.Id.ToString() == decodedToken.Id);
            return Results.Json(new User
            {
                Id = user.Id,
                Email = user.Email,
                Password = user.Password,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                Roles = user.Roles,
            });
        }

        private void CreateDefaultUserCategories(User user)
        {
            List<string> categoryNames = new List<string> { "Business", "Arts", "Productivity Tools", "Shopping", "Email", "Social", "Entertainment" };
            List<Category> createdCategories = new List<Category>();
            foreach (string categoryName in categoryNames)
                this.CategoryRepository.Create(new Category { UserId = user.Id, Name = categoryName });
        }
    }
}
