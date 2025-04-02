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
            services.AddScoped<IDbServicesInterface<Entry>, EntryServices>();
            services.AddScoped<IDbServicesInterface<Item>, ItemServices>();
            services.AddScoped<IDbServicesInterface<CategoryItem>, CategoryItemServices>();

            //Identity Services
            services.AddScoped<IDbServicesInterface<UserData>, UserDataServices>();
            services.AddScoped<IDbServicesInterface<Account>, AccountServices>();
            services.AddScoped<IDbServicesInterface<Role>, RoleServices>();
            services.AddScoped<IDbServicesInterface<AccountRole>, AccountRoleServices>();
        }
    }
}