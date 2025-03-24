using ErrorHandling;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using Persistence.Models.Transaction;

namespace backend.Controllers.Transaction
{
    public class CategoryController : AbstractBaseController<Category>
    {

        public CategoryController(IDbServicesInterface<Category> entryCategoryServices,
                                        ILogger<CategoryController> logger)
        : base(entryCategoryServices, logger)
        {
        }

        [HttpPost("NewCategory")]
        public async Task<ActionResult> Create([FromBody] Category newCategory)
        {
            var returnValue = await _dbService.InsertRowAsync(newCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateCategory")]
        public async Task<ActionResult> Update([FromBody] Category entryCategory)
        {
            var returnValue = await _dbService.UpdateRowAsync(entryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteCategory")]
        public async Task<ActionResult> Delete([FromBody] Category entryCategory)
        {
            var returnValue = await _dbService.DeleteRowAsync(entryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetCategory")]
        public async Task<ActionResult> Get([FromBody] Category entryCategory)
        {
            var returnValue = await _dbService.GetRowAsync(entryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAllCategories")]
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