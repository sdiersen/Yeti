using Microsoft.AspNetCore.Mvc;
using Persistence.DTOs.Transaction;
using Persistence.Models.Transaction;
using Persistence.Services.Transaction;

namespace backend.Controllers.Transaction
{
    public class ItemController : AbstractBaseController<Item>
    {
        private readonly IItemServices _itemServices;
        public ItemController(ILogger<ItemController> logger, IItemServices itemServices)
        : base(logger)
        {
            _itemServices = itemServices;
        }

        [HttpPost("NewItem")]
        public async Task<ActionResult> Create([FromBody] ItemDTO newItem)
        {
            var returnValue = await _itemServices.CreateAndReturnItemAsync(newItem);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAllItems")]
        public async Task<ActionResult> GetAll()
        {
            var returnValue = await _itemServices.GetAllItemsAsync();
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAllItemsByCategoryId/{categoryId}")]
        public async Task<ActionResult> GetAllByCategoryId(int categoryId)
        {
            var returnValue = await _itemServices.GetAllItemsByCategoryIdAsync(categoryId);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteItem/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var item = new Item { Id = id };
            var returnValue = await _itemServices.DeleteItemAsync(item);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateItem")]
        public async Task<ActionResult> Update([FromBody] Item item)
        {
            var returnValue = await _itemServices.UpdateAndReturnItemAsync(item);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }
    }
}