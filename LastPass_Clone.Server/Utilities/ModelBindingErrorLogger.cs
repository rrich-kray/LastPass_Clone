using Microsoft.AspNetCore.Mvc.Filters;
using PasswordManager.Server.Types;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using PasswordManager.Server.Utilities;

namespace PasswordManager.Server.Utilities
{
    public static class ModelBindingErrorLogger
    {
        public static ControllerResponse<T> LogErrorMessages<T>(ModelStateDictionary modelState, ControllerResponse<T> response)
        {
            System.Diagnostics.Debug.WriteLine("MODEL BINDING ERROR");
            response.Success = false;
            foreach (var keyModelStatePair in modelState)
            {
                var key = keyModelStatePair.Key;
                var modelErrors = keyModelStatePair.Value.Errors;
                if (modelErrors.Count > 0)
                {
                    var messages = new List<string>();
                    var errorMessages = modelErrors.Select(error => error.ErrorMessage.ToString());
                    foreach (var errorMessage in errorMessages)
                    {
                        System.Diagnostics.Debug.WriteLine($"ModelState error: {errorMessage}");
                        messages.Add(errorMessage);
                    }
                    response.Messages = messages;
                }
            }
            return response;
        }
    }
}
