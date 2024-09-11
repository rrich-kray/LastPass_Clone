using Microsoft.AspNetCore.Mvc.Filters;
using PasswordManager.Server.Types;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace PasswordManager.Server.Utilities
{
    public static class ModelBindingErrorLogger
    {
        public static Response LogErrorMessages(ModelStateDictionary modelState, Response response)
        {
            System.Diagnostics.Debug.WriteLine("MODEL BINDING ERROR");
            response.Result = false;
            foreach (var keyModelStatePair in modelState)
            {
                var key = keyModelStatePair.Key;
                var modelErrors = keyModelStatePair.Value.Errors;
                if (modelErrors.Count > 0)
                {
                    var errorMessages = modelErrors.Select(error => error.ErrorMessage.ToString());
                    foreach (var errorMessage in errorMessages)
                    {
                        System.Diagnostics.Debug.WriteLine($"ModelState error: {errorMessage}");
                        response.Message.Add(errorMessage);
                    }
                }
            }
            return response;
        }
    }
}
