using Microsoft.AspNetCore.Mvc;
using Persistence.DTOs.Identity;
using Persistence.Models.Identity;
using Persistence.Services.Identity;

namespace backend.Controllers.Identity
{
    public class AccountController : AbstractBaseController<Account>
    {
        private readonly IAccountServices _accountServices;
        public AccountController(ILogger<AccountController> logger, IAccountServices accountServices)
            : base(logger)
        {
            _accountServices = accountServices;
        }

        [HttpPost("NewAccount")]
        public async Task<ActionResult> Create([FromBody] RegisterDTO newAccount)
        {
            var returnValue = await _accountServices.CreateAccountAsync(newAccount);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPost("Login")]
        public async Task<ActionResult> Login([FromBody] LoginDTO account)
        {
            var returnValue = await _accountServices.LoginAsync(account);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateAccount")]
        public async Task<ActionResult> Update([FromBody] UpdateAccountDTO updateAccount)
        {
            if (updateAccount == null || updateAccount.Account == null || updateAccount.Roles == null)
            {
                return BadRequest("Invalid data provided for UpdateAccount.");
            }
            var returnValue = await _accountServices.UpdateAccountAsync(updateAccount);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteAccount/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            // Assuming there's a method in IAccountServices to delete an account by ID
            var returnValue = await _accountServices.DeleteAccountAsync(id);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }
    }
}
