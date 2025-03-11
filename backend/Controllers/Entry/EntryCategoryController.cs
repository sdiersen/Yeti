using Persistence.Models.Entry;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers.Entry
{
    public class EntryCategoryController : AbstractBaseController<EntryCategory>
    {

        public EntryCategoryController(IDbServicesInterface<EntryCategory> entryCategoryServices,
                                        ILogger<EntryCategoryController> logger)
        : base(entryCategoryServices, logger)
        {
        }

        [HttpPost("NewEntryCategory")]
        public async Task<ActionResult> Create([FromBody] EntryCategory newEntryCategory)
        {
            var returnValue = await _dbService.InsertRowAsync(newEntryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateEntryCategory")]
        public async Task<ActionResult> Update([FromBody] EntryCategory entryCategory)
        {
            var returnValue = await _dbService.UpdateRowAsync(entryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteEntryCategory")]
        public async Task<ActionResult> Delete([FromBody] EntryCategory entryCategory)
        {
            var returnValue = await _dbService.DeleteRowAsync(entryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetEntryCategory")]
        public async Task<ActionResult> Get([FromBody] EntryCategory entryCategory)
        {
            var returnValue = await _dbService.GetRowAsync(entryCategory);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }





    }
}