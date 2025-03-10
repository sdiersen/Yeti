using backend.Persistence.Models.Entry;
using backend.Persistence.Models.Identity;
using backend.Persistence.ModelValidations;
using backend.Persistence.ModelValidations.Entry;
using backend.Persistence.ModelValidations.Identity;

namespace backend.Persistence
{
    public static class ServiceExtensions
    {
        public static void CustomModelValidationServices(this IServiceCollection services)
        {
            //Entry Services
            services.AddScoped<IModelValidation<EntryCategory>, EntryCategoryValidation>();
            services.AddScoped<IModelValidation<Item>, ItemValidation>();

            //Identity Services
            services.AddScoped<IModelValidation<UserData>, UserDataValidation>();
        }
    }
}