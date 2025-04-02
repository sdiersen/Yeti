using Persistence.Models.Transaction;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers.Transaction
{
    public class EntryController : AbstractBaseController<Entry>
    {

        public EntryController(IDbServicesInterface<Entry> entryCategoryServices,
                                        ILogger<EntryController> logger)
        : base(entryCategoryServices, logger)
        {
        }

        [HttpPost("NewEntry")]
        public async Task<ActionResult> Create([FromBody] Entry newEntry)
        {
            var returnValue = await _dbService.InsertRowAsync(newEntry);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateEntry")]
        public async Task<ActionResult> Update([FromBody] Entry entryCategory)
        {
            var returnValue = await _dbService.UpdateRowAsync(entryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteEntry")]
        public async Task<ActionResult> Delete([FromBody] Entry entryCategory)
        {
            var returnValue = await _dbService.DeleteRowAsync(entryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetEntry")]
        public async Task<ActionResult> Get([FromQuery] Entry entryCategory)
        {
            var returnValue = await _dbService.GetRowAsync(entryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetEntryById/{id}")]
        public async Task<ActionResult> GetById(int id)
        {
            var returnValue = await _dbService.GetRowAsync(id);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }
    }
}