using Persistence.Models.Transaction;

namespace backend.Controllers.Transaction
{
    public class CategoryItemController : AbstractBaseController<CategoryItem>
    {
        public CategoryItemController(ILogger<CategoryItemController> logger)
        : base(logger)
        {
        }
    }
}