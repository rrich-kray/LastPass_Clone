using Microsoft.AspNetCore.Mvc;
using PasswordManager.Server.Data.DatabaseContexts;
using PasswordManager.Server.Types;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Utilities;
using System.Net;

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

        [Route("/Create")]
        [HttpPost]
        public Response Create([FromBody] Category category) =>
            ControllerUtils.CommonControllerCreate(
                validator: new CategoryEntityValidator(),
                validatee: category,
                repository: this.CategoryRepository, 
                modelState: ModelState);

        [Route("/Delete/{categoryId}")]
        [HttpDelete]
        public Response Delete(int categoryId) =>
            ControllerUtils.CommonControllerDelete<Category>(
                this.CategoryRepository, 
                categoryId, 
                "Category deletion successful.");
    }
}
