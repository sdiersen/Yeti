using Persistence.Models.Transaction;
using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("GetAllEntries")]
        public async Task<ActionResult> GetAll()
        {                                      
            var results = await _entryServices.GetAllEntriesAsync();
            if (!results.Success)
            {
                return BadRequest(results);
            }
            return Ok(results);
        }

        [HttpGet("GetAllEntriesByItemId/{itemId}")]
        public async Task<ActionResult> GetAllEntriesByItemId(int itemId)
        {
            var results = await _entryServices.GetAllEntriesByItemIdAsync(itemId);
            if (!results.Success)
            {
                return BadRequest(results);
            }
            return Ok(results);
        }

        [HttpPut("UpdateEntry")]
        public async Task<ActionResult> UpdateEntry([FromBody] Entry entry)
        {
            var results = await _entryServices.UpdateEntryAsync(entry);
            if (!results.Success)
            {
                return BadRequest(results);
            }
            return Ok(results);
        }
    }
}