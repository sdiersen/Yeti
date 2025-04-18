using Microsoft.AspNetCore.Mvc;
using Persistence;
using Persistence.Models.Identity;

namespace backend.Controllers.Identity
{
    public class AccountRoleController : AbstractBaseController<AccountRole>
    {
        public AccountRoleController(ILogger<AccountRoleController> logger)
            : base(logger)
        {
            
        }
    }
}