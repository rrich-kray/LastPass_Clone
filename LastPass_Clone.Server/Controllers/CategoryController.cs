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
    [Route("/Categories")]
    public class CategoriesController : Controller
    {
        private CategoryRepository CategoryRepository { get; set; }
        public CategoriesController(CategoryRepository passwordManagerRepository)
        {
            this.CategoryRepository = passwordManagerRepository;
        }

        [Route("/GetCategories")]
        [HttpGet]
        public IEnumerable<Category> GetCategories() => this.CategoryRepository.Categories;

        [Route("/GetCategoriesByUserId")]
        [HttpGet]
        public IEnumerable<Category> GetPasswordsByUserId()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Split(" ")[1];
            var decodedToken = new AuthService().Decode(token);
            return this.CategoryRepository.Categories.Where(category => category.UserId.ToString().Equals(decodedToken.Id));
        }

        [Route("/Create")]
        [HttpPost]
        public ControllerResponse<Category> Create([FromBody] Category category) =>
            ControllerUtils.CommonControllerCreate(
                validator: new CategoryEntityValidator(),
                validatee: category,
                repository: this.CategoryRepository,
                modelState: ModelState);

        [Route("/Delete/{categoryId}")]
        [HttpDelete]
        public ControllerResponse<Category> Delete(int categoryId) =>
            ControllerUtils.CommonControllerDelete<Category>(
                this.CategoryRepository, 
                categoryId, 
                "Category deletion successful.");
    }
}
