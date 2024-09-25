using FluentValidation;
using Microsoft.AspNetCore.Mvc.Filters;
using PasswordManager.Server.Data.Entities;
using PasswordManager.Server.Data.Repositories;
using PasswordManager.Server.Types;
using PasswordManager.Server.Utilities;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace PasswordManager.Server.Utilities
{
    public class ControllerResponse<T>
    {
        public bool Success { get; set; }
        public T? Entity { get; set; }
        public List<string>? Messages = new List<string>();
    }
    public static class ControllerUtils
    {
        public static IResult CommonControllerCreate<T, J, K>(
            T validator,
            J validatee,
            K repository,
            ModelStateDictionary modelState)
            where T : AbstractValidator<J>
            where K : IPasswordManagerRepository<J>
            where J : class
        {
            ControllerResponse<J> response = new ControllerResponse<J>();
            if (!modelState.IsValid) return Results.Json(ModelBindingErrorLogger.LogErrorMessages(modelState, response));
            var validationResult = validator.Validate(validatee);
            if (!validationResult.IsValid)
            {
                System.Diagnostics.Debug.WriteLine("FLUENT VALIDATION ERROR");
                response.Success = false;
                List<string> errorMessages = new List<string>();
                foreach (var errorMessage in validationResult.Errors)
                {
                    System.Diagnostics.Debug.WriteLine($"Error: {errorMessage.ErrorMessage}");
                    errorMessages.Add(errorMessage.ErrorMessage.ToString());
                }
                response.Messages = errorMessages;
                return Results.Json(response);
            }
            try
            {
                var entity = repository.Create(validatee);
                response.Success = true;
                response.Messages = new List<string> { $"{validatee.GetType().Name} creation successful." };
                response.Entity = entity;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Messages = new List<string> { ex.Message };
            }
            return Results.Json(response);
        }

        public static IResult CommonControllerUpdate<T, J, K>(
            T validator,
            J validatee,
            K repository,
            ModelStateDictionary modelState)
            where T : AbstractValidator<J>
            where K : IPasswordManagerRepository<J>
            where J : class
        {
            ControllerResponse<J> response = new ControllerResponse<J>();
            if (!modelState.IsValid) return Results.Json(ModelBindingErrorLogger.LogErrorMessages(modelState, response));
            var validationResult = validator.Validate(validatee);
            if (!validationResult.IsValid)
            {
                System.Diagnostics.Debug.WriteLine("FLUENT VALIDATION ERROR");
                response.Success = false;
                List<string> errorMessages = new List<string>();
                foreach (var errorMessage in validationResult.Errors)
                    errorMessages.Add(errorMessage.ErrorMessage);
                response.Messages = errorMessages;
                return Results.Json(response); ;
            }
            try
            {
                var entity = repository.Update(validatee);
                response.Success = true;
                response.Messages = new List<string> { $"{validatee.GetType().Name} update successful." };
                response.Entity = entity;
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Messages = new List<string> { ex.Message };
            }
            return Results.Json(response);
        }

        public static IResult CommonControllerDelete<T>(
            IPasswordManagerRepository<T> repository,
            int id,
            string successMessage)
        {
            ControllerResponse<T> response = new ControllerResponse<T>();
            try
            {
                repository.Delete(id);
                response.Success = true;
                response.Messages = new List<string> { successMessage };
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Messages = new List<string> { ex.Message };
            }
            return Results.Json(response);
        }
    }
}
