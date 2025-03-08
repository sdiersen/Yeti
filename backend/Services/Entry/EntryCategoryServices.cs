using backend.Persistence.Migrations.Constants;
using backend.Persistence.Models.Entry;
using backend.Persistence.ModelValidations;
using Dapper;
using Library.ErrorHandling;
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
            return await Task.Run(() => GetRow(row));
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
            //create the query
            var sql = $@"
                            INSERT INTO {DbTableNames.ENTRY_CATEGORY_TABLE} 
                            (
                                {DbEntryCategoryTable.NAME}, 
                                {DbEntryCategoryTable.DESCRIPTION}
                            ) 
                            VALUES 
                            (
                                @Name, 
                                @Description
                            );
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("Name", row.Name);
            parameters.Add("Description", row.Description);
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Execute(sql, parameters);
                    return new ReturnValue { Success = true };
                }
                catch (Exception e)
                {
                    return new ReturnValue
                    {
                        Success = false,
                        Errors = new List<string> { e.Message },
                        Messages = new List<string> { "Error inserting row" }
                    };
                }
            }
        }

        public Task<ReturnValue> InsertRowAsync(EntryCategory row)
        {
            return Task.Run(() => InsertRow(row));
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
            //create the query
            var sql = $@"
                            UPDATE {DbTableNames.ENTRY_CATEGORY_TABLE} 
                            SET 
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

        public Task<ReturnValue> UpdateRowAsync(int id, EntryCategory row)
        {
            return Task.Run(() => UpdateRow(id, row));
        }

        public Task<ReturnValue> UpdateRowAsync(EntryCategory row)
        {
            return Task.Run(() => UpdateRow(row));
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

        public Task<ReturnValue> DeleteRowAsync(EntryCategory row)
        {
            return Task.Run(() => DeleteRow(row));
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