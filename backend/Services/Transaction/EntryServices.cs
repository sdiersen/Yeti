using Persistence.Migrations.Constants;
using Persistence.Models.Transaction;
using Persistence.ModelValidations;
using Dapper;
using ErrorHandling;
using Microsoft.Data.SqlClient;
using Persistence;

namespace backend.Services.Transaction
{
    public class EntryServices : DbBaseLayer<EntryServices, Entry>, IDbServicesInterface<Entry>
    {
        public EntryServices(
            ILogger<EntryServices> logger,
            IConfiguration configuration,
            IModelValidation<Entry> modelValidation)
            : base(logger, configuration, modelValidation)
        {
        }


        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        public ReturnValue<Entry> GetRow(Entry row)
        {
            return GetRow(row.Id);
        }
        public ReturnValue<Entry> GetRowAsTransaction(Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            return GetRowAsTransaction(row.Id, connection, transaction);
        }

        public async Task<ReturnValue<Entry>> GetRowAsync(Entry row)
        {
            return await GetRowAsync(row.Id);
        }
        public async Task<ReturnValue<Entry>> GetRowAsTransactionAsync(Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            return await GetRowAsTransactionAsync(row.Id, connection, transaction);
        }

        //****************************************************************************************************
        // InsertRow
        //****************************************************************************************************
        public ReturnValue InsertRow(Entry row)
        {
            //Do validation
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            //If validation passes, do insert row
            //set the created and modified dates
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            return InsertRowBase(_InsertRowSQL, FullEntryParamsNoId(row));
        }
        public ReturnValue InsertRowAsTransaction(Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;
            return InsertRowBaseAsTransaction(_InsertRowSQL, FullEntryParamsNoId(row), connection, transaction);
        }

        public async Task<ReturnValue> InsertRowAsync(Entry row)
        {
            //Do validation
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            //If validation passes, do insert row
            //set the created and modified dates
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            return await InsertRowBaseAsync(_InsertRowSQL, FullEntryParamsNoId(row));
        }
        public async Task<ReturnValue> InsertRowAsTransactionAsync(Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;
            return await InsertRowBaseAsTransactionAsync(_InsertRowSQL, FullEntryParamsNoId(row), connection, transaction);
        }

        //****************************************************************************************************
        // UpdateRow
        //****************************************************************************************************
        public ReturnValue UpdateRow(int id, Entry row)
        {
            //Do validation
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }

            //If validation passes, do update row
            //set the modified date
            row.ModifiedOn = DateTime.Now;

            return UpdateRowBase(_UpdateRowSQL, FullEntryParams(row));
        }
        public ReturnValue UpdateRowAsTransaction(int id, Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            //Do validation
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            //If validation passes, do update row
            //set the modified date
            row.ModifiedOn = DateTime.Now;
            return UpdateRowBaseAsTransaction(_UpdateRowSQL, FullEntryParams(row), connection, transaction);
        }

        public ReturnValue UpdateRow(Entry row)
        {
            return UpdateRow(row.Id, row);
        }
        public ReturnValue UpdateRowAsTransaction(Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            return UpdateRowAsTransaction(row.Id, row, connection, transaction);
        }

        public async Task<ReturnValue> UpdateRowAsync(int id, Entry row)
        {
            //Do validation
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }

            //If validation passes, do update row
            //set the modified date
            row.ModifiedOn = DateTime.Now;

            return await UpdateRowBaseAsync(_UpdateRowSQL, FullEntryParams(row));
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(int id, Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            //Do validation
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            //If validation passes, do update row
            //set the modified date
            row.ModifiedOn = DateTime.Now;
            return await UpdateRowBaseAsTransactionAsync(_UpdateRowSQL, FullEntryParams(row), connection, transaction);
        }

        public async Task<ReturnValue> UpdateRowAsync(Entry row)
        {
            return await UpdateRowAsync(row.Id, row);
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            return await UpdateRowAsTransactionAsync(row.Id, row, connection, transaction);
        }

        //****************************************************************************************************
        // DeleteRow
        //****************************************************************************************************
        public ReturnValue DeleteRow(Entry row)
        {
            return DeleteRow(row.Id);
        }
        public ReturnValue DeleteRowAsTransaction(Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            return DeleteRowAsTransaction(row.Id, connection, transaction);
        }

        public async Task<ReturnValue> DeleteRowAsync(Entry row)
        {
            return await DeleteRowAsync(row.Id);
        }
        public async Task<ReturnValue> DeleteRowAsTransactionAsync(Entry row, SqlConnection connection, SqlTransaction transaction)
        {
            return await DeleteRowAsTransactionAsync(row.Id, connection, transaction);
        }

        //****************************************************************************************************
        // Private Helper Methods
        //****************************************************************************************************



        //****************************************************************************************************
        // Private string constant sql queries
        //****************************************************************************************************
        private const string _InsertRowSQL = @$"
                            INSERT INTO {DbTableNames.ENTRY_TABLE} 
                            (
                                {DbEntryTable.CREATED_ON},
                                {DbEntryTable.MODIFIED_ON},
                                {DbEntryTable.AMOUNT},
                                {DbEntryTable.IS_EXPENSE}, 
                                {DbEntryTable.ENTRY_DATE},
                                {DbEntryTable.CATEGORY_ID},
                                {DbEntryTable.ITEM_ID},
                                {DbEntryTable.NOTE}
                            )
                            VALUES 
                            (
                                @CreatedOn,
                                @ModifiedOn,
                                @Amount, 
                                @IsExpense,
                                @EntryDate,
                                @CategoryId,
                                @ItemId,
                                @Note
                            );
                        ";
        private const string _UpdateRowSQL = @$"
                            UPDATE {DbTableNames.ENTRY_TABLE} 
                            SET 
                                {DbEntryTable.MODIFIED_ON} = @ModifiedOn,
                                {DbEntryTable.AMOUNT} = @Amount,
                                {DbEntryTable.IS_EXPENSE} = @IsExpense,
                                {DbEntryTable.ENTRY_DATE} = @EntryDate,
                                {DbEntryTable.CATEGORY_ID} = @CategoryId,
                                {DbEntryTable.ITEM_ID} = @ItemId,
                                {DbEntryTable.NOTE} = @Note
                            WHERE {DbEntryTable.ID} = @Id
                            ;
                        ";



        //****************************************************************************************************
        // Private DynamicParameters Helper Methods
        //****************************************************************************************************
        private DynamicParameters FullEntryParamsNoId(Entry row)
        {
            var parameters = new DynamicParameters();
            parameters.Add("CreatedOn", row.CreatedOn);
            parameters.Add("ModifiedOn", row.ModifiedOn);
            parameters.Add("Amount", row.Amount);
            parameters.Add("IsExpense", row.IsExpense);
            parameters.Add("EntryDate", row.EntryDate);
            parameters.Add("CategoryId", row.CategoryId);
            parameters.Add("ItemId", row.ItemId);
            parameters.Add("Note", row.Note);
            return parameters;
        }

        private DynamicParameters FullEntryParams(Entry row)
        {
            var parameters = FullEntryParamsNoId(row);
            parameters.Add("Id", row.Id);
            return parameters;
        }
    }
}