using backend.Persistence.Migrations.Constants;
using backend.Persistence.Models.Entry;
using backend.Persistence.ModelValidations;
using Dapper;
using ErrorHandling;
using Microsoft.Data.SqlClient;
using Persistence;

namespace backend.Services.Entry
{
    public class EntryCategoryServices : DbBaseLayer<EntryCategoryServices, EntryCategory>,
                                                    IDbServicesInterface<EntryCategory>
    {
        public EntryCategoryServices(
            ILogger<EntryCategoryServices> logger,
            IConfiguration configuration,
            IModelValidation<EntryCategory> modelValidation)
            : base(logger, configuration, modelValidation)
        {
        }


        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        public ReturnValue<EntryCategory> GetRow(EntryCategory row)
        {
            try
            {
                int id = FindIdByCategoryName(row.Name);
                return GetRow(id);
            }
            catch (Exception e)
            {
                return new ReturnValue<EntryCategory>
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by category name" }
                };
            }
        }

        public async Task<ReturnValue<EntryCategory>> GetRowAsync(EntryCategory row)
        {
            try
            {
                int id = FindIdByCategoryName(row.Name);
                return await GetRowAsync(id);
            }
            catch (Exception e)
            {
                return new ReturnValue<EntryCategory>
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by category name" }
                };
            }
        }

        //****************************************************************************************************
        // InsertRow
        //****************************************************************************************************
        public ReturnValue InsertRow(EntryCategory row)
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
            //create the query
            var sql = $@"
                            INSERT INTO {DbTableNames.ENTRY_CATEGORY_TABLE} 
                            (
                                {DbEntryCategoryTable.CREATED_ON},
                                {DbEntryCategoryTable.MODIFIED_ON},
                                {DbEntryCategoryTable.NAME}, 
                                {DbEntryCategoryTable.DESCRIPTION}
                            ) 
                            VALUES 
                            (
                                @CreatedOn,
                                @ModifiedOn,
                                @Name, 
                                @Description
                            );
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("CreatedOn", row.CreatedOn);
            parameters.Add("ModifiedOn", row.ModifiedOn);
            parameters.Add("Name", row.Name);
            parameters.Add("Description", row.Description);
            return InsertRowBase(sql, parameters);
        }

        public async Task<ReturnValue> InsertRowAsync(EntryCategory row)
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
            //create the query
            var sql = $@"
                            INSERT INTO {DbTableNames.ENTRY_CATEGORY_TABLE} 
                            (
                                {DbEntryCategoryTable.CREATED_ON},
                                {DbEntryCategoryTable.MODIFIED_ON},
                                {DbEntryCategoryTable.NAME}, 
                                {DbEntryCategoryTable.DESCRIPTION}
                            ) 
                            VALUES 
                            (
                                @CreatedOn,
                                @ModifiedOn,
                                @Name, 
                                @Description
                            );
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("CreatedOn", row.CreatedOn);
            parameters.Add("ModifiedOn", row.ModifiedOn);
            parameters.Add("Name", row.Name);
            parameters.Add("Description", row.Description);
            return await InsertRowBaseAsync(sql, parameters);
        }

        //****************************************************************************************************
        // UpdateRow
        //****************************************************************************************************
        public ReturnValue UpdateRow(int id, EntryCategory row)
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
            //create the query
            var sql = $@"
                            UPDATE {DbTableNames.ENTRY_CATEGORY_TABLE} 
                            SET 
                                {DbEntryCategoryTable.MODIFIED_ON} = @ModifiedOn,
                                {DbEntryCategoryTable.NAME} = @Name, 
                                {DbEntryCategoryTable.DESCRIPTION} = @Description
                            WHERE {DbEntryCategoryTable.ID} = @Id
                            ;
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("Id", id);
            parameters.Add("Name", row.Name);
            parameters.Add("Description", row.Description);
            parameters.Add("ModifiedOn", row.ModifiedOn);
            return UpdateRowBase(sql, parameters);
        }

        public ReturnValue UpdateRow(EntryCategory row)
        {
            try
            {
                int id = FindIdByCategoryName(row.Name);
                return UpdateRow(id, row);
            }
            catch (Exception e)
            {
                return new ReturnValue
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by category name" }
                };
            }
        }

        public async Task<ReturnValue> UpdateRowAsync(int id, EntryCategory row)
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
            //create the query
            var sql = $@"
                            UPDATE {DbTableNames.ENTRY_CATEGORY_TABLE} 
                            SET 
                                {DbEntryCategoryTable.MODIFIED_ON} = @ModifiedOn,
                                {DbEntryCategoryTable.NAME} = @Name, 
                                {DbEntryCategoryTable.DESCRIPTION} = @Description
                            WHERE {DbEntryCategoryTable.ID} = @Id
                            ;
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("Id", id);
            parameters.Add("Name", row.Name);
            parameters.Add("Description", row.Description);
            parameters.Add("ModifiedOn", row.ModifiedOn);
            return await UpdateRowBaseAsync(sql, parameters);
        }

        public async Task<ReturnValue> UpdateRowAsync(EntryCategory row)
        {
            try
            {
                int id = FindIdByCategoryName(row.Name);
                return await UpdateRowAsync(id, row);
            }
            catch (Exception e)
            {
                return new ReturnValue
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by category name" }
                };
            }
        }

        //****************************************************************************************************
        // DeleteRow
        //****************************************************************************************************
        public ReturnValue DeleteRow(EntryCategory row)
        {
            try
            {
                int id = FindIdByCategoryName(row.Name);
                return DeleteRow(id);
            }
            catch (Exception e)
            {
                return new ReturnValue
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by category name" }
                };
            }
        }

        public async Task<ReturnValue> DeleteRowAsync(EntryCategory row)
        {
            try
            {
                int id = FindIdByCategoryName(row.Name);
                return await DeleteRowAsync(id);
            }
            catch (Exception e)
            {
                return new ReturnValue
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by category name" }
                };
            }
        }

        //****************************************************************************************************
        // Private Helper Methods
        //****************************************************************************************************

        private int FindIdByCategoryName(string categoryName)
        {
            int id = -1;

            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    string sql = $@"
                                    SELECT {DbEntryCategoryTable.ID} 
                                    FROM {DbTableNames.ENTRY_CATEGORY_TABLE} 
                                    WHERE {DbEntryCategoryTable.NAME} = @CategoryName
                                    ;";

                    id = connection.QueryFirstOrDefault<int>(sql, new { CategoryName = categoryName });
                    return id;
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }
    }
}