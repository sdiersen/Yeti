using Microsoft.AspNetCore.Mvc;
using Persistence;
using Persistence.Models.Identity;

namespace backend.Controllers.Identity
{
    public class RoleController : AbstractBaseController<Role>
    {
        public RoleController(ILogger<RoleController> logger)
            : base(logger)
        {
        }
    }
}