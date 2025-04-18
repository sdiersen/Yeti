using Persistence.Models.Transaction;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers.Transaction
{
    public class ItemController : AbstractBaseController<Item>
    {

        public ItemController(ILogger<ItemController> logger)
        : base(logger)
        {
        }
    }
}