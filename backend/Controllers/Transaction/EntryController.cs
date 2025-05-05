using Persistence.Models.Transaction;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using Persistence.DTOs.Transaction;
using Persistence.Services.Transaction;

namespace backend.Controllers.Transaction
{
    public class EntryController : AbstractBaseController<Entry>
    {
        private readonly IEntryServices _entryServices;
        public EntryController(ILogger<EntryController> logger, IEntryServices entryServices)
        : base(logger)
        {
            _entryServices = entryServices;
        }

        [HttpPost("CreateEntry")]
        public async Task<ActionResult> CreateEntry([FromBody] EntryDTO entryDTO)
        {
            var results = await _entryServices.CreateEntryAsync(entryDTO);
            if (!results.Success)
            {
                return BadRequest(results);
            }
            return Ok(results);
        }
    }
}