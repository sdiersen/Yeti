using Microsoft.AspNetCore.Mvc;
using Persistence.DTOs.Transaction;
using Persistence.Models.Transaction;
using Persistence.Services.Transaction;

namespace backend.Controllers.Transaction
{
    public class CategoryController : AbstractBaseController<Category>
    {
        private readonly ICategoryServices _categoryServices;
        public CategoryController(ILogger<CategoryController> logger, ICategoryServices categoryServices)
        : base(logger)
        {
            _categoryServices = categoryServices;
        }

        [HttpPost("NewCategory")]
        public async Task<ActionResult> Create([FromBody] CategoryDTO newCategory)
        {
            var returnValue = await _categoryServices.CreateCategoryAsync(newCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }
        [HttpGet("GetAllCategories")]
        public async Task<ActionResult> GetAll()
        {
            var returnValue = await _categoryServices.GetAllCategoriesAsync();
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            if (returnValue.Data == null || returnValue.Data.Count <= 0)
            {
                return NotFound("No categores found.");
            }
            return Ok(returnValue);
        }
        [HttpDelete("DeleteCategory/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var returnValue = await _categoryServices.DeleteCategoryAsync(id);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }
        [HttpPut("UpdateCategory")]
        public async Task<ActionResult> Update([FromBody] Category category)
        {
            var returnValue = await _categoryServices.UpdateCategoryAsync(category);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }
    }
}