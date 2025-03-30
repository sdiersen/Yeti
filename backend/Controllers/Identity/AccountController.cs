using Microsoft.AspNetCore.Mvc;
using Persistence;
using Persistence.Models.Identity;

namespace backend.Controllers.Identity
{
    public class AccountController : AbstractBaseController<Account>
    {
        public AccountController(IDbServicesInterface<Account> accountServices, ILogger<AccountController> logger)
            : base(accountServices, logger)
        {
        }

        [HttpPost("NewAccount")]
        public async Task<ActionResult> Create([FromBody] Account newAccount)
        {
            var returnValue = await _dbService.InsertRowAsync(newAccount);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateAccount")]
        public async Task<ActionResult> Update([FromBody] Account account)
        {
            var returnValue = await _dbService.UpdateRowAsync(account);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteAccount")]
        public async Task<ActionResult> Delete([FromBody] Account account)
        {
            var returnValue = await _dbService.DeleteRowAsync(account);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAccount")]
        public async Task<ActionResult> Get([FromBody] Account account)
        {
            var returnValue = await _dbService.GetRowAsync(account);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAccountById/{id}")]
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
