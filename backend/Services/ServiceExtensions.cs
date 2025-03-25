using Persistence.Models.Transaction;
using Persistence.Models.Identity;
using backend.Services.Transaction;
using backend.Services.Identity;
using Persistence;

namespace backend.Services
{
    public static class ServiceExtensions
    {
        public static void CustomDbServices(this IServiceCollection services)
        {
            //Transaction Services
            services.AddScoped<IDbServicesInterface<Category>, CategoryServices>();
            services.AddScoped<IDbServicesInterface<CategoryItem>, CategoryItemServices>();
            services.AddScoped<IDbServicesInterface<Entry>, EntryServices>();
            services.AddScoped<IDbServicesInterface<Item>, ItemServices>();

            //Identity Services
            services.AddScoped<IDbServicesInterface<UserData>, UserDataServices>();
        }
    }
}