using Microsoft.AspNetCore.Mvc;
using Persistence.Models.Identity;
using Persistence.Services.Identity;

namespace backend.Controllers.Identity
{
    public class RoleController : AbstractBaseController<Role>
    {
        private readonly IRoleServices _roleServices;
        public RoleController(ILogger<RoleController> logger, IRoleServices roleServices)
            : base(logger)
        {
            _roleServices = roleServices;
        }

        [HttpGet("GetAllRoles")]
        public async Task<ActionResult> GetAllRoles()
        {
            var returnValue = await _roleServices.GetAllRolesAsync();
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            if (returnValue.Data == null || returnValue.Data.Count == 0)
            {
                return NotFound("No roles found.");
            }
            return Ok(returnValue);
        }
    }
}