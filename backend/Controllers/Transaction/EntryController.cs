using Persistence.Models.Transaction;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers.Transaction
{
    public class EntryController : AbstractBaseController<Entry>
    {

        public EntryController(ILogger<EntryController> logger)
        : base(logger)
        {
        }
    }
}