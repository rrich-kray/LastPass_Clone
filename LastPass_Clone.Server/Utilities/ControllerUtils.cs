using FluentValidation;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Types;

namespace PasswordManager.Server.Utilities
{
    public static class ControllerUtils
    {
        public static Response CommonControllerCreate<T, J, K>(
            T validator,
            J validatee,
            K repository)
            where T : AbstractValidator<J>
            where K : IPasswordManagerRepository<J>
            where J : class
        {
            Response response = new Response();
            var validationResult = validator.Validate(validatee);
            if (!validationResult.IsValid)
            {
                response.Result = false;
                List<string> errorMessages = new List<string>();
                foreach (var errorMessage in validationResult.Errors)
                    errorMessages.Add(errorMessage.ErrorMessage);
                response.Message = errorMessages;
                return response;
            }
            try
            {
                repository.Create(validatee);
                response.Result = true;
                response.Message = new List<string> { $"{validatee.GetType().Name} creation successful." };
            }
            catch (Exception ex)
            {
                response.Result = false;
                response.Message = new List<string> { ex.Message };
            }
            return response;
        }

        public static Response CommonControllerUpdate<T, J, K>(
            T validator,
            J validatee,
            K repository)
            where T : AbstractValidator<J>
            where K : IPasswordManagerRepository<J>
            where J : class
        {
            Response response = new Response();
            var validationResult = validator.Validate(validatee);
            if (!validationResult.IsValid)
            {
                response.Result = false;
                List<string> errorMessages = new List<string>();
                foreach (var errorMessage in validationResult.Errors)
                    errorMessages.Add(errorMessage.ErrorMessage);
                response.Message = errorMessages;
                return response;
            }
            try
            {
                repository.Update(validatee);
                response.Result = true;
                response.Message = new List<string> { $"{validatee.GetType().Name} update successful." };
            }
            catch (Exception ex)
            {
                response.Result = false;
                response.Message = new List<string> { ex.Message };
            }
            return response;
        }

        public static Response CommonControllerDelete<T>(
            IPasswordManagerRepository<T> repository, 
            int id,
            string successMessage)
        {
            Response response = new Response();
            try
            {
                repository.Delete(id);
                response.Result = true;
                response.Message = new List<string> { successMessage };
            }
            catch (Exception ex)
            {
                response.Result = false;
                response.Message = new List<string> { ex.Message };
            }
            return response;
        }
    }
}
