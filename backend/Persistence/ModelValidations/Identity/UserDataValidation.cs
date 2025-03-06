
using System.Text.RegularExpressions;
using Library.ErrorHandling;
using backend.Persistence.Models.Identity;

namespace backend.Persistence.ModelValidations.Identity
{
    public class UserDataValidation : IModelValidation<UserData>
    {
        public ReturnValue ValidateModel(UserData model)
        {
            ReturnValue returnValue = new ReturnValue();

            string error = ValidateUserName(model.Username);
            if (!string.IsNullOrWhiteSpace(error))
            {
                returnValue.Errors.Add(error);
            }

            error = ValidateEmail(model.Email);
            if (!string.IsNullOrWhiteSpace(error))
            {
                returnValue.Errors.Add(error);
            }

            error = ValidatePassword(model.Password);
            if (!string.IsNullOrWhiteSpace(error))
            {
                returnValue.Errors.Add(error);
            }

            // if there are no errors
            if (returnValue.Errors.Count == 0)
            {
                returnValue.Success = true;
            }

            return returnValue;
        }

        //should I call each validation method asynchronously?
        public async Task<ReturnValue> ValidateModelAsync(UserData model)
        {
            return await Task.Run(() => ValidateModel(model));
        }

        private string ValidateUserName(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return "Username is null or empty.";
            }
            if (!Regex.IsMatch(username, @"^[a-zA-Z0-9]{3,20}$"))
            {
                return "Username must be between 3 and 20 characters long and contain only letters and numbers.";
            }

            return string.Empty;
        }

        private string ValidateEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return "Email is null or empty.";
            }
            if (!Regex.IsMatch(email, @"^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$"))
            {
                return "Email is not in the correct format.";
            }

            return string.Empty;
        }

        private string ValidatePassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                return "Password is null or empty.";
            }
            if (!Regex.IsMatch(password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$"))
            {
                return "Password must be between 8 and 15 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.";
            }

            return string.Empty;
        }
    }
}