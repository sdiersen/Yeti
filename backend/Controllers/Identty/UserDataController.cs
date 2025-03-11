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

        [HttpPost("NewAccount")]
        public async Task<ActionResult> Create([FromBody] UserData newUser)
        {
            var returnValue = await _dbService.InsertRowAsync(newUser);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateAccount")]
        public async Task<ActionResult> Update([FromBody] UserData user)
        {
            var returnValue = await _dbService.UpdateRowAsync(user);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteAccount")]
        public async Task<ActionResult> Delete([FromBody] UserData user)
        {
            var returnValue = await _dbService.DeleteRowAsync(user);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAccount")]
        public async Task<ActionResult> Get([FromBody] UserData user)
        {
            var returnValue = await _dbService.GetRowAsync(user);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }




    }
}