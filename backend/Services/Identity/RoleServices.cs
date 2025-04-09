using Persistence.Models.Identity;
using Persistence;
using Persistence.Migrations.Constants;
using Persistence.ModelValidations;
using ErrorHandling;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Identity.Client;

namespace backend.Services.Identity
{
    public class RoleServices : DbBaseLayer<RoleServices, Role>, IDbServicesInterface<Role>
    {
        public RoleServices(
            ILogger<RoleServices> logger,
            IConfiguration configuration,
            IModelValidation<Role> modelValidation)
            : base(logger, configuration, modelValidation)
        {
            TableName = DbTableNames.ROLE_TABLE;
        }

        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        /// <summary>
        /// Returns the row based on the unique RoleName
        /// </summary>
        /// <param name="row"></param>
        /// <returns></returns>
        public ReturnValue<Role> GetRow(Role row)
        {
            var returnValue = new ReturnValue<Role>();
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var result = connection.QuerySingleOrDefault<Role>(
                        _GetRowByRoleNameSQL,
                        RoleNameParams(row.RoleName)
                    );
                    if (result != null)
                    {
                        returnValue.Data = result;
                        returnValue.Success = true;
                    }
                    else
                    {
                        returnValue.AddMessage("database", $"Role with name {row.RoleName} not found.");
                    }
                }
            }
            catch (SqlException ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            catch (Exception ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            return returnValue;
        }
        public ReturnValue<Role> GetRowAsTransaction(Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = new ReturnValue<Role>();
            try
            {
                var result = connection.QuerySingleOrDefault<Role>(_GetRowByRoleNameSQL, RoleNameParams(row.RoleName), transaction);
                if (result != null)
                {
                    returnValue.Data = result;
                    returnValue.Success = true;
                }
                else
                {
                    returnValue.AddMessage("database", $"Role with name {row.RoleName} not found.");
                }
            }
            catch (SqlException ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            catch (Exception ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            return returnValue;
        }
        /// <summary>
        /// Returns the row based on the unique RoleName asynchronously
        /// </summary>
        /// <param name="row"></param>
        /// <returns></returns>
        public async Task<ReturnValue<Role>> GetRowAsync(Role row)
        {
            var returnValue = new ReturnValue<Role>();
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var result = await connection.QuerySingleOrDefaultAsync<Role>( _GetRowByRoleNameSQL, RoleNameParams(row.RoleName));
                    if (result != null)
                    {
                        returnValue.Data = result;
                        returnValue.Success = true;
                    }
                    else
                    {
                        returnValue.AddMessage("database", $"Role with name {row.RoleName} not found.");
                    }
                }
            }
            catch (SqlException ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            catch (Exception ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            return returnValue;
        }
        public async Task<ReturnValue<Role>> GetRowAsTransactionAsync(Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = new ReturnValue<Role>();
            try
            {
                var result = await connection.QuerySingleOrDefaultAsync<Role>(_GetRowByRoleNameSQL, RoleNameParams(row.RoleName), transaction);
                if (result != null)
                {
                    returnValue.Data = result;
                    returnValue.Success = true;
                }
                else
                {
                    returnValue.AddMessage("database", $"Role with name {row.RoleName} not found.");
                }
            }
            catch (SqlException ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            catch (Exception ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            return returnValue;
        }
        //*****************************************************************************************************
        // InsertRow
        //*****************************************************************************************************
        public ReturnValue InsertRow(Role row)
        {
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            //If validation passes, do insert row
            //set the created and modified dates
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            //can't call InsertRowBase because Name must be unique and InsertRowBase doesn't return that exception
            var returnValue = new ReturnValue();
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var result = connection.Execute(_InsertRoleSQL, FullRoleParamsNoId(row));
                    if (result > 0)
                    {
                        returnValue.Success = true;
                    }
                    else
                    {
                        returnValue.AddMessage("database", $"Failed to insert role {row.RoleName}.");
                    }
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
            }
            return returnValue;
        }
        public ReturnValue InsertRowAsTransaction(Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            //If validation passes, do insert row
            //set the created and modified dates
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;
            //can't call InsertRowBase because Name must be unique and InsertRowBase doesn't return that exception
            var returnValue = new ReturnValue();
            try
            {
                var result = connection.Execute(_InsertRoleSQL, FullRoleParamsNoId(row), transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                }
                else
                {
                    returnValue.AddMessage("database", $"Failed to insert role {row.RoleName}.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
            }
            return returnValue;
        }

        public async Task<ReturnValue> InsertRowAsync(Role row)
        {
            var validationResult = await _modelValidation.ValidateModelAsync(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            //If validation passes, do insert row
            //set the created and modified dates
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            //can't call InsertRowBase because Name must be unique and InsertRowBase doesn't return that exception
            var returnValue = new ReturnValue();
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var result = await connection.ExecuteAsync(
                        _InsertRoleSQL,
                        FullRoleParamsNoId(row)
                    );
                    if (result > 0)
                    {
                        returnValue.Success = true;
                    }
                    else
                    {
                        returnValue.AddMessage("database", $"Failed to insert role {row.RoleName}.");
                    }
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
            }
            return returnValue;
        }
        public async Task<ReturnValue> InsertRowAsTransactionAsync(Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = await _modelValidation.ValidateModelAsync(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            //If validation passes, do insert row
            //set the created and modified dates
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;
            //can't call InsertRowBase because Name must be unique and InsertRowBase doesn't return that exception
            var returnValue = new ReturnValue();
            try
            {
                var result = await connection.ExecuteAsync(_InsertRoleSQL, FullRoleParamsNoId(row), transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                }
                else
                {
                    returnValue.AddMessage("database", $"Failed to insert role {row.RoleName}.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
            }
            return returnValue;
        }

        //*****************************************************************************************************
        // UpdateRow
        //*****************************************************************************************************
            /// <summary>
            /// Update the Role row based on the Id of the row (will still check to make sure RoleName is unique)
            /// </summary>
            /// <param name="id"></param>
            /// <param name="row"></param>
            /// <returns></returns>
        public ReturnValue UpdateRow(int id, Role row)
        {
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            //If validation passes, do update row
            //set the modified date
            row.ModifiedOn = DateTime.Now;
            row.Id = id;

            // can't call UpdateRowBase because Name must be unique and UpdateRowBase doesn't return that exception
            var returnValue = new ReturnValue();
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    var result = connection.Execute(
                        _UpdateRoleSQL,
                        FullRoleParams(row)
                    );
                    if (result > 0)
                    {
                        returnValue.Success = true;
                    }
                    else
                    {
                        returnValue.AddMessage("database", $"Failed to update role {row.RoleName}.");
                    }
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
            }
            return returnValue;
        }
        public ReturnValue UpdateRowAsTransaction(int id, Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            //If validation passes, do update row
            //set the modified date
            row.ModifiedOn = DateTime.Now;
            row.Id = id;
            // can't call UpdateRowBase because Name must be unique and UpdateRowBase doesn't return that exception
            var returnValue = new ReturnValue();
            try
            {
                var result = connection.Execute(_UpdateRoleSQL, FullRoleParams(row), transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                }
                else
                {
                    returnValue.AddMessage("database", $"Failed to update role {row.RoleName}.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
            }
            return returnValue;
        }
        /// <summary>
        /// Update the Role row based on the Id of the row (will still check to make sure RoleName is unique)
        /// This is the async version of UpdateRow(int id, Role row)
        /// </summary>
        /// <param name="id"></param>
        /// <param name="row"></param>
        /// <returns></returns>
        public async Task<ReturnValue> UpdateRowAsync(int id, Role row)
        {
            var validationResult = await _modelValidation.ValidateModelAsync(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            //If validation passes, do update row
            //set the modified date
            row.ModifiedOn = DateTime.Now;
            row.Id = id;

            // can't call UpdateRowBase because Name must be unique and UpdateRowBase doesn't return that exception
            var returnValue = new ReturnValue();
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    var result = await connection.ExecuteAsync(
                        _UpdateRoleSQL,
                        FullRoleParams(row)
                    );
                    if (result > 0)
                    {
                        returnValue.Success = true;
                    }
                    else
                    {
                        returnValue.AddMessage("database", $"Failed to update role {row.RoleName}.");
                    }
                }
            }
            catch (SqlException ex)
            {
                if (ex.Number == 2627) // Unique constraint error
                {
                    returnValue.AddMessage("database", $"Role with name {row.RoleName} already exists.");
                }
                else
                {
                    returnValue.AddError("database", ex.Message);
                }
            }
            catch (Exception ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            return returnValue;
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(int id, Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = await _modelValidation.ValidateModelAsync(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }

            row.ModifiedOn = DateTime.Now;
            row.Id = id;
            var returnValue = new ReturnValue();
            try
            {
                var result = await connection.ExecuteAsync(_UpdateRoleSQL, FullRoleParams(row), transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                }
                else
                {
                    returnValue.AddMessage("database", $"Failed to update role {row.RoleName}.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
            }
            return returnValue;
        }
        /// <summary>
        /// Update the Role row based on the RoleName
        /// </summary>
        /// <param name="row"></param>
        /// <returns></returns>
        public ReturnValue UpdateRow(Role row)
        {
            //validation is done in UpdateRow(int id, Role row), if it gets there
            // Find the Role row id by the RoleName
            var getRowResult = GetRow(row);
            if (!getRowResult.Success)
            {
                return new ReturnValue
                {
                    Success = false,
                    Messages = getRowResult.Messages,
                    Errors = getRowResult.Errors

                };
            }
            row.Id = getRowResult.Data!.Id; // if Success = true then Data is not null, hence Data! is safe to use
            return UpdateRow(row.Id, row);
        }
        public ReturnValue UpdateRowAsTransaction(Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success) 
            {
                return validationResult;
            }

            row.ModifiedOn = DateTime.UtcNow;
            row.Id = row.Id;
            var returnValue = new ReturnValue();
            try
            {
                var result = connection.Execute(_UpdateRoleSQL, FullRoleParams(row), transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                }
                else
                {
                    returnValue.AddMessage("database", $"Failed to update role {row.RoleName}.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
            }
            return returnValue;
        }
        /// <summary>
        /// Update the Role row based on the RoleName
        /// This is the async version of UpdateRow(Role row)
        /// </summary>
        /// <param name="row"></param>
        /// <returns></returns>
        public async Task<ReturnValue> UpdateRowAsync(Role row)
        {
            // Validation is done in UpdateRowAsync, if it gets there
            // Find the Role row id by the RoleName
            var getRowResult = await GetRowAsync(row);
            if (!getRowResult.Success)
            {
                return new ReturnValue
                {
                    Success = false,
                    Messages = getRowResult.Messages,
                    Errors = getRowResult.Errors

                };
            }
            row.Id = getRowResult.Data!.Id; // if Success = true then Data is not null, hence Data! is safe to use
            return await UpdateRowAsync(row.Id, row);
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = await _modelValidation.ValidateModelAsync(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            row.ModifiedOn = DateTime.UtcNow;
            row.Id = row.Id;
            var returnValue = new ReturnValue();
            try
            {
                var result = await connection.ExecuteAsync(_UpdateRoleSQL, FullRoleParams(row), transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                }
                else
                {
                    returnValue.AddMessage("database", $"Failed to update role {row.RoleName}.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
            }
            return returnValue;
        }

        //*****************************************************************************************************
        // DeleteRow
        //*****************************************************************************************************
        public ReturnValue DeleteRow(Role row)
        {
            var getRowResult = GetRow(row);
            if (!getRowResult.Success)
            {
                return new ReturnValue
                {
                    Success = false,
                    Messages = getRowResult.Messages,
                    Errors = getRowResult.Errors
                };
            }
            row.Id = getRowResult.Data!.Id; // if Success = true then Data is not null, hence Data! is safe to use
            return DeleteRow(row.Id);
        }
        public ReturnValue DeleteRowAsTransaction(Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var getRowResult = GetRowAsTransaction(row, connection, transaction);
            if (!getRowResult.Success)
            {
                return new ReturnValue
                {
                    Success = false,
                    Messages = getRowResult.Messages,
                    Errors = getRowResult.Errors
                };
            }
            row.Id = getRowResult.Data!.Id; // if Success = true then Data is not null, hence Data! is safe to use
            return DeleteRowAsTransaction(row.Id, connection, transaction);
        }
        public async Task<ReturnValue> DeleteRowAsync(Role row)
        {
            var getRowResult = await GetRowAsync(row);
            if (!getRowResult.Success)
            {
                return new ReturnValue
                {
                    Success = false,
                    Messages = getRowResult.Messages,
                    Errors = getRowResult.Errors
                };
            }
            row.Id = getRowResult.Data!.Id; // if Success = true then Data is not null, hence Data! is safe to use
            return await DeleteRowAsync(row.Id);
        }
        public async Task<ReturnValue> DeleteRowAsTransactionAsync(Role row, SqlConnection connection, SqlTransaction transaction)
        {
            var getRowResult = await GetRowAsTransactionAsync(row, connection, transaction);
            if (!getRowResult.Success)
            {
                return new ReturnValue
                {
                    Success = false,
                    Messages = getRowResult.Messages,
                    Errors = getRowResult.Errors
                };
            }
            row.Id = getRowResult.Data!.Id; // if Success = true then Data is not null, hence Data! is safe to use
            return await DeleteRowAsTransactionAsync(row.Id, connection, transaction);
        }


        //*****************************************************************************************************
        // Private string constant sql queries
        //*****************************************************************************************************
        private const string _InsertRoleSQL = $@"
                            INSERT INTO {DbTableNames.ROLE_TABLE} 
                            (
                                {DbRoleTable.ROLE_NAME}, 
                                {DbRoleTable.ROLE_NUMBER}, 
                                {DbRoleTable.DESCRIPTION}
                            )
                            VALUES 
                            (
                                @RoleName, 
                                @RoleNumber, 
                                @Description
                            )
                        ;"
                    ;

        private const string _UpdateRoleSQL = $@"
                            UPDATE {DbTableNames.ROLE_TABLE} 
                            SET                                 
                                {DbRoleTable.ROLE_NAME} = @RoleName, 
                                {DbRoleTable.ROLE_NUMBER} = @RoleNumber,
                                {DbRoleTable.DESCRIPTION} = @Description
                            WHERE {DbCommonColumns.ID} = @Id
                        ;"
                    ;

        private const string _GetRowByRoleNameSQL = $@"
                            SELECT *
                            FROM {DbTableNames.ROLE_TABLE} 
                            WHERE {DbRoleTable.ROLE_NAME} = @RoleName
                        ;"
                    ;

        //*****************************************************************************************************
        // Private DynamicParameters Helper Methods
        //*****************************************************************************************************
        private DynamicParameters FullRoleParamsNoId(Role row)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@RoleName", row.RoleName);
            parameters.Add("@RoleNumber", row.RoleNumber);
            parameters.Add("@Description", row.Description);
            return parameters;
        }
        private DynamicParameters FullRoleParams(Role row)
        {
            var parameters = FullRoleParamsNoId(row);
            parameters.Add("@Id", row.Id);
            return parameters;
        }
        private DynamicParameters RoleNameParams(string name)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@RoleName", name);
            return parameters;
        }


        //*****************************************************************************************************
        // Private Helper Methods
        //*****************************************************************************************************
        private static ReturnValue HandleModifyExceptions(Exception ex, ReturnValue returnValue)
        {
            switch (ex)
            {
                case SqlException sqlException:
                    if (sqlException.Number == 2627) // Unique constraint error number
                    {
                        returnValue.AddMessage("database", "Username already exists.");
                    }
                    else
                    {
                        returnValue.AddMessage("database", "Database error: " + sqlException.Message);
                    }
                    break;
                case Exception exception:
                    returnValue.AddMessage("database", "Error: " + exception.Message);
                    break;
            }
            return returnValue;
        }
    }
}