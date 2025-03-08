using backend.Persistence.Models.Entry;
using Library.ErrorHandling;

namespace backend.Persistence.ModelValidations.Entry
{
    public class EntryCategoryValidation : IModelValidation<EntryCategory>
    {

        public ReturnValue ValidateModel(EntryCategory model)
        {
            ReturnValue returnValue = new ReturnValue();
            List<string> messages = ValidateName(model.Name);
            if (messages.Count > 0)
            {
                returnValue.Messages.AddRange(messages);
            }
            messages = ValidateDescription(model.Description);
            if (messages.Count > 0)
            {
                returnValue.Messages.AddRange(messages);
            }
            returnValue.Success = returnValue.Messages.Count == 0;
            return returnValue;
        }

        public Task<ReturnValue> ValidateModelAsync(EntryCategory model)
        {
            throw new NotImplementedException();
        }

        //These private methods should probably return a list<string> or string[] of errors
        //since ReturnValue.Errors and ReturnValue.Messages are Lists of strings
        private List<string> ValidateName(string name)
        {
            List<string> errors = new List<string>();
            if (string.IsNullOrWhiteSpace(name))
            {
                errors.Add("Name is null or empty.");
            }
            if (name.Length > 50)
            {
                errors.Add("Name cannot be greater than 50 characters.");
            }

            return errors;
        }

        private List<string> ValidateDescription(string description)
        {
            List<string> errors = new List<string>();
            if (string.IsNullOrWhiteSpace(description))
            {
                errors.Add("Entry categories need a description.");
            }
            if (description.Length > 500)
            {
                errors.Add("Description cannot be greater than 500 characters.");
            }

            return errors;
        }
    }
}