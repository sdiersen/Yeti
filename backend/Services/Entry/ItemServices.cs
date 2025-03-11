
using Persistence.Migrations.Constants;
using Persistence.Models.Entry;
using Persistence.ModelValidations;
using Dapper;
using ErrorHandling;
using Persistence;

namespace backend.Services.Entry
{
    public class ItemServices : DbBaseLayer<ItemServices, Item>,
                                        IDbServicesInterface<Item>
    {
        public ItemServices(
            ILogger<ItemServices> logger,
            IConfiguration configuration,
            IModelValidation<Item> modelValidation)
            : base(logger, configuration, modelValidation)
        {
        }

        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        /// <summary>
        /// Get a specific item from the database. 
        /// Items might have a name or a description, but they are not unique
        /// This means getting by row must be done by id
        /// </summary>
        /// <param name="row"></param>
        /// <returns>the item if id = row.id</returns>
        /// <exception cref="NotImplementedException"></exception>
        public ReturnValue<Item> GetRow(Item row)
        {
            return GetRow(row.Id);
        }

        public async Task<ReturnValue<Item>> GetRowAsync(Item row)
        {
            return await GetRowAsync(row.Id);
        }

        //****************************************************************************************************
        // InsertRow
        //****************************************************************************************************
        public ReturnValue InsertRow(Item row)
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
                            INSERT INTO {DbTableNames.ITEM_TABLE} 
                            (
                                {DbItemTable.CREATED_ON},
                                {DbItemTable.MODIFIED_ON},
                                {DbItemTable.NAME},
                                {DbItemTable.DESCRIPTION},
                                {DbItemTable.AMOUNT}
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

        public async Task<ReturnValue> InsertRowAsync(Item row)
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
                            INSERT INTO {DbTableNames.ITEM_TABLE} 
                            (
                                {DbItemTable.CREATED_ON},
                                {DbItemTable.MODIFIED_ON},
                                {DbItemTable.NAME},
                                {DbItemTable.DESCRIPTION},
                                {DbItemTable.AMOUNT}
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
        public ReturnValue UpdateRow(int id, Item row)
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
                            UPDATE {DbTableNames.ITEM_TABLE}
                            SET
                                {DbItemTable.MODIFIED_ON} = @ModifiedOn,
                                {DbItemTable.NAME} = @Name,
                                {DbItemTable.DESCRIPTION} = @Description,
                                {DbItemTable.AMOUNT} = @Amount
                            WHERE
                                {DbItemTable.ID} = @Id;
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
        public ReturnValue UpdateRow(Item row)
        {
            return UpdateRow(row.Id, row);
        }

        public async Task<ReturnValue> UpdateRowAsync(int id, Item row)
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
                            UPDATE {DbTableNames.ITEM_TABLE}
                            SET
                                {DbItemTable.MODIFIED_ON} = @ModifiedOn,
                                {DbItemTable.NAME} = @Name,
                                {DbItemTable.DESCRIPTION} = @Description,
                                {DbItemTable.AMOUNT} = @Amount
                            WHERE
                                {DbItemTable.ID} = @Id;
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

        public async Task<ReturnValue> UpdateRowAsync(Item row)
        {
            return await UpdateRowAsync(row.Id, row);
        }

        //****************************************************************************************************
        // DeleteRow
        //****************************************************************************************************
        //Delete row without an id doesn't make sense currently as the only
        //unique value in the row is the id.
        public ReturnValue DeleteRow(Item row)
        {
            return DeleteRow(row.Id);
        }

        public async Task<ReturnValue> DeleteRowAsync(Item row)
        {
            return await DeleteRowAsync(row.Id);
        }

        //****************************************************************************************************
        // Private Helper Methods
        //****************************************************************************************************

    }
}
