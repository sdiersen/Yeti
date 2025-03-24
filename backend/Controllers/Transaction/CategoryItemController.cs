using Microsoft.AspNetCore.Mvc;
using Persistence;
using Persistence.Migrations.Entry;

namespace backend.Controllers.Transaction
{
    public class CategoryItemController : AbstractBaseController<CategoryItem>
    {
        public CategoryItemController(IDbServicesInterface<CategoryItem> entryCategoryServices,
                                        ILogger<CategoryItemController> logger)
        : base(entryCategoryServices, logger)
        {
        }

        [HttpPost("NewCategoryItem")]
        public async Task<ActionResult> Create([FromBody] CategoryItem newCategoryItem)
        {
            var returnValue = await _dbService.InsertRowAsync(newCategoryItem);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateCategoryItem")]
        public async Task<ActionResult> Update([FromBody] CategoryItem entryCategoryItem)
        {
            var returnValue = await _dbService.UpdateRowAsync(entryCategoryItem);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteCategoryItem")]
        public async Task<ActionResult> Delete([FromBody] CategoryItem entryCategoryItem)
        {
            var returnValue = await _dbService.DeleteRowAsync(entryCategoryItem);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetCategoryItem")]
        public async Task<ActionResult> Get([FromBody] CategoryItem entryCategoryItem)
        {
            var returnValue = await _dbService.GetRowAsync(entryCategoryItem);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAllCategoryItems")]
        public async Task<ActionResult> GetAll()
        {
            var returnValue = await _dbService.GetFirstXRowsAsync(0);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }
    }
}