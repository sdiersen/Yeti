using backend.Persistence.Models.Identity;
using backend.Services.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers.Identity
{
    // First controller in this app. Probably need to make a base class for controllers in future
    [ApiController]
    [Route("api/[controller]")]
    public class UserDataController : ControllerBase
    {
        private readonly UserDataServices _userDataServices;

        public UserDataController(UserDataServices userDataServices)
        {
            _userDataServices = userDataServices;
        }

        [HttpPost]
        public IActionResult InsertRow(UserData row)
        {
            var returnValue = _userDataServices.InsertRow(row);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRow(int id, UserData row)
        {
            var returnValue = _userDataServices.UpdateRow(id, row);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }
    }
}