using Persistence.Models.Transaction;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers.Transaction
{
    public class ItemController : AbstractBaseController<Item>
    {

        public ItemController(IDbServicesInterface<Item> itemServices,
                                    ILogger<ItemController> logger)
        : base(itemServices, logger)
        {
        }

        [HttpPost("NewItem")]
        public async Task<ActionResult> Create([FromBody] Item newItem)
        {
            var returnValue = await _dbService.InsertRowAsync(newItem);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateItem")]
        public async Task<ActionResult> Update([FromBody] Item item)
        {
            var returnValue = await _dbService.UpdateRowAsync(item);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteItem")]
        public async Task<ActionResult> Delete([FromBody] Item item)
        {
            var returnValue = await _dbService.DeleteRowAsync(item);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetItem")]
        public async Task<ActionResult> Get([FromQuery] Item item)
        {
            var returnValue = await _dbService.GetRowAsync(item);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var returnValue = await _dbService.GetRowAsync(id);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAllItems")]
        public async Task<ActionResult> GetAll(int count)
        {
            var returnValue = await _dbService.GetFirstXRowsAsync(count);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }





    }
}