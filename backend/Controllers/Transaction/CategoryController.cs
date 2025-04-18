using Microsoft.AspNetCore.Mvc;
using Persistence;
using Persistence.Models.Transaction;

namespace backend.Controllers.Transaction
{
    public class CategoryController : AbstractBaseController<Category>
    {

        public CategoryController(ILogger<CategoryController> logger)
        : base(logger)
        {
        }
    }
}