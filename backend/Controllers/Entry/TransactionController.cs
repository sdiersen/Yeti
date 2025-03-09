using backend.Persistence.Models.Entry;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace backend.Controllers.Entry
{
    public class TransactionController : AbstractBaseController<Transaction>
    {

        public TransactionController(IDbServicesInterface<Transaction> transactionServices,
                                    ILogger<TransactionController> logger)
        : base(transactionServices, logger)
        {
        }

        [HttpPost("NewTransaction")]
        public async Task<ActionResult> Create([FromBody] Transaction newTransaction)
        {
            var returnValue = await _dbService.InsertRowAsync(newTransaction);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpPut("UpdateTransaction")]
        public async Task<ActionResult> Update([FromBody] Transaction transaction)
        {
            var returnValue = await _dbService.UpdateRowAsync(transaction);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpDelete("DeleteTransaction")]
        public async Task<ActionResult> Delete([FromBody] Transaction transaction)
        {
            var returnValue = await _dbService.DeleteRowAsync(transaction);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetTransaction")]
        public async Task<ActionResult> Get([FromBody] Transaction transaction)
        {
            var returnValue = await _dbService.GetRowAsync(transaction);
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }

        [HttpGet("GetAllTransactions")]
        public async Task<ActionResult> GetAll()
        {
            var returnValue = await _dbService.GetXRowsAsync();
            if (!returnValue.Success)
            {
                return BadRequest(returnValue);
            }
            return Ok(returnValue);
        }





    }
}