using Persistence.Models.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers.Identity
{
    public class UserDataController : AbstractBaseController<UserData>
    {

        public UserDataController(ILogger<UserDataController> logger)
        : base(logger)
        {
        }
    }
}