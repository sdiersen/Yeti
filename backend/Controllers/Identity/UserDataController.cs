using Persistence.Models.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers.Identity
{
    public class UserDataController : AbstractBaseController<UserData>
    {

        public UserDataController(IDbServicesInterface<UserData> userDataServices, ILogger<UserDataController> logger)
        : base(userDataServices, logger)
        {
        }

        [HttpPost("NewUserData")]
        public async Task<ActionResult> Create([FromBody] UserData newUser)
        {
            var returnValue = await _dbService.InsertRowAsync(newUser);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateUserData")]
        public async Task<ActionResult> Update([FromBody] UserData user)
        {
            var returnValue = await _dbService.UpdateRowAsync(user);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteUserData")]
        public async Task<ActionResult> Delete([FromBody] UserData user)
        {
            var returnValue = await _dbService.DeleteRowAsync(user);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetUserData")]
        public async Task<ActionResult> Get([FromQuery] UserData user)
        {
            var returnValue = await _dbService.GetRowAsync(user);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetUserDataById/{id}")]
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