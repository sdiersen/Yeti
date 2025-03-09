
using backend.Persistence.Migrations.Constants;
using backend.Persistence.Models;
using backend.Persistence.Models.Entry;
using backend.Persistence.ModelValidations;
using Dapper;
using Library.ErrorHandling;
using Microsoft.Data.SqlClient;
using Persistence;

namespace backend.Services.Entry
{
    public class TransactionServices : DbBaseLayer<TransactionServices, Transaction>,
                                        IDbServicesInterface<Transaction>
    {
        public TransactionServices(
            ILogger<TransactionServices> logger,
            IConfiguration configuration,
            IModelValidation<Transaction> modelValidation)
            : base(logger, configuration, modelValidation)
        {
        }

        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        /// <summary>
        /// Get a specific transaction from the database. 
        /// Transactions might have a name or a description, but they are not unique
        /// This means getting by row must be done by id
        /// </summary>
        /// <param name="row"></param>
        /// <returns>the Transaction is id = row.id</returns>
        /// <exception cref="NotImplementedException"></exception>
        public ReturnValue<Transaction> GetRow(Transaction row)
        {
            return GetRow(row.Id);
        }

        public async Task<ReturnValue<Transaction>> GetRowAsync(Transaction row)
        {
            return await GetRowAsync(row.Id);
        }

        //****************************************************************************************************
        // InsertRow
        //****************************************************************************************************
        public ReturnValue InsertRow(Transaction row)
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

            //create the sql
            var sql = $@"
                            INSERT INTO {DbTableNames.TRANSACTION_TABLE} 
                            (
                                {DbTransactionTable.CREATED_ON},
                                {DbTransactionTable.MODIFIED_ON},
                                {DbTransactionTable.NAME},
                                {DbTransactionTable.DESCRIPTION},
                                {DbTransactionTable.AMOUNT}
                            )
                            VALUES
                            (
                                @CreatedOn,
                                @ModifiedOn,
                                @Name,
                                @Description,
                                @Amount
                            );
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("CreatedOn", row.CreatedOn);
            parameters.Add("ModifiedOn", row.ModifiedOn);
            parameters.Add("Name", row.Name);
            parameters.Add("Description", row.Description);
            parameters.Add("Amount", row.Amount);
            //run the query
            return InsertRowBase(sql, parameters);
        }

        public async Task<ReturnValue> InsertRowAsync(Transaction row)
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

            //create the sql
            var sql = $@"
                            INSERT INTO {DbTableNames.TRANSACTION_TABLE} 
                            (
                                {DbTransactionTable.CREATED_ON},
                                {DbTransactionTable.MODIFIED_ON},
                                {DbTransactionTable.NAME},
                                {DbTransactionTable.DESCRIPTION},
                                {DbTransactionTable.AMOUNT}
                            )
                            VALUES
                            (
                                @CreatedOn,
                                @ModifiedOn,
                                @Name,
                                @Description,
                                @Amount
                            );
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("CreatedOn", row.CreatedOn);
            parameters.Add("ModifiedOn", row.ModifiedOn);
            parameters.Add("Name", row.Name);
            parameters.Add("Description", row.Description);
            parameters.Add("Amount", row.Amount);
            //run the query
            return await InsertRowBaseAsync(sql, parameters);
        }

        //****************************************************************************************************
        // UpdateRow
        //****************************************************************************************************
        public ReturnValue UpdateRow(int id, Transaction row)
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

            //create the sql
            var sql = $@"
                            UPDATE {DbTableNames.TRANSACTION_TABLE}
                            SET
                                {DbTransactionTable.MODIFIED_ON} = @ModifiedOn,
                                {DbTransactionTable.NAME} = @Name,
                                {DbTransactionTable.DESCRIPTION} = @Description,
                                {DbTransactionTable.AMOUNT} = @Amount
                            WHERE
                                {DbTransactionTable.ID} = @Id;
                        ";

            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("ModifiedOn", row.ModifiedOn);
            parameters.Add("Name", row.Name);
            parameters.Add("Description", row.Description);
            parameters.Add("Amount", row.Amount);

            //run the query
            return UpdateRowBase(sql, parameters);
        }

        //Update row without an id doens't make sense currently as the only
        //unique value in the row is the id.
        public ReturnValue UpdateRow(Transaction row)
        {
            return UpdateRow(row.Id, row);
        }

        public async Task<ReturnValue> UpdateRowAsync(int id, Transaction row)
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

            //create the sql
            var sql = $@"
                            UPDATE {DbTableNames.TRANSACTION_TABLE}
                            SET
                                {DbTransactionTable.MODIFIED_ON} = @ModifiedOn,
                                {DbTransactionTable.NAME} = @Name,
                                {DbTransactionTable.DESCRIPTION} = @Description,
                                {DbTransactionTable.AMOUNT} = @Amount
                            WHERE
                                {DbTransactionTable.ID} = @Id;
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("ModifiedOn", row.ModifiedOn);
            parameters.Add("Name", row.Name);
            parameters.Add("Description", row.Description);
            parameters.Add("Amount", row.Amount);
            parameters.Add("Id", id);
            //run the query
            return await UpdateRowBaseAsync(sql, parameters);
        }

        public async Task<ReturnValue> UpdateRowAsync(Transaction row)
        {
            return await UpdateRowAsync(row.Id, row);
        }

        //****************************************************************************************************
        // DeleteRow
        //****************************************************************************************************
        //Delete row without an id doesn't make sense currently as the only
        //unique value in the row is the id.
        public ReturnValue DeleteRow(Transaction row)
        {
            return DeleteRow(row.Id);
        }

        public async Task<ReturnValue> DeleteRowAsync(Transaction row)
        {
            return await DeleteRowAsync(row.Id);
        }

        //****************************************************************************************************
        // Private Helper Methods
        //****************************************************************************************************

    }
}
