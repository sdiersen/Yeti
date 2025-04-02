using Microsoft.AspNetCore.Mvc;
using Persistence;
using Persistence.Models.Identity;

namespace backend.Controllers.Identity
{
    public class RoleController : AbstractBaseController<Role>
    {
        public RoleController(IDbServicesInterface<Role> roleServices, ILogger<RoleController> logger)
            : base(roleServices, logger)
        {
        }

        [HttpPost("NewRole")]
        public async Task<ActionResult> Create([FromBody] Role newRole)
        {
            var returnValue = await _dbService.InsertRowAsync(newRole);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateRole")]
        public async Task<ActionResult> Update([FromBody] Role role)
        {
            var returnValue = await _dbService.UpdateRowAsync(role);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteRole")]
        public async Task<ActionResult> Delete([FromBody] Role role)
        {
            var returnValue = await _dbService.DeleteRowAsync(role);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetRole")]
        public async Task<ActionResult> Get([FromQuery] Role role)
        {
            var returnValue = await _dbService.GetRowAsync(role);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetRoleById/{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var returnValue = await _dbService.GetRowAsync(id);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }
    }
}