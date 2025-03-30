using Microsoft.AspNetCore.Mvc;
using Persistence;
using Persistence.Models.Identity;

namespace backend.Controllers.Identity
{
    public class AccountRoleController : AbstractBaseController<AccountRole>
    {
        public AccountRoleController(IDbServicesInterface<AccountRole> accountRoleServices, ILogger<AccountRoleController> logger)
            : base(accountRoleServices, logger)
        {
        }

        [HttpPost("NewAccountRole")]
        public async Task<ActionResult> Create([FromBody] AccountRole newAccountRole)
        {
            var returnValue = await _dbService.InsertRowAsync(newAccountRole);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateAccountRole")]
        public async Task<ActionResult> Update([FromBody] AccountRole accountRole)
        {
            var returnValue = await _dbService.UpdateRowAsync(accountRole);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteAccountRole")]
        public async Task<ActionResult> Delete([FromBody] AccountRole accountRole)
        {
            var returnValue = await _dbService.DeleteRowAsync(accountRole);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAccountRole")]
        public async Task<ActionResult> Get([FromBody] AccountRole accountRole)
        {
            var returnValue = await _dbService.GetRowAsync(accountRole);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAccountRoleById/{id}")]
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