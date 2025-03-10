using backend.Persistence.Models.Entry;
using backend.Persistence.Models.Identity;
using backend.Services.Entry;
using backend.Services.Identity;
using Persistence;

namespace backend.Services
{
    public static class ServiceExtensions
    {
        public static void CustomDbServices(this IServiceCollection services)
        {
            //Entry Services
            services.AddScoped<IDbServicesInterface<EntryCategory>, EntryCategoryServices>();
            services.AddScoped<IDbServicesInterface<Item>, ItemServices>();

            //Identity Services
            services.AddScoped<IDbServicesInterface<UserData>, UserDataServices>();
        }
    }
}