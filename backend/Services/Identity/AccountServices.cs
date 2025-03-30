using Dapper;
using ErrorHandling;
using Microsoft.Data.SqlClient;
using Persistence;
using Persistence.Migrations.Constants;
using Persistence.Models.Identity;
using Persistence.ModelValidations;

namespace backend.Services.Identity
{
    public class AccountServices : DbBaseLayer<AccountServices, Account>, IDbServicesInterface<Account>
    {
        public AccountServices(
            ILogger<AccountServices> logger,
            IConfiguration configuration,
            IModelValidation<Account> modelValidation)
            : base(logger, configuration, modelValidation)
        {
            TableName = DbTableNames.ACCOUNT_TABLE;
        }

        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        /// <summary>
        /// Get a username and password and check if they are valid.
        /// </summary>
        /// <param name="row">Account object</param>
        /// <returns>
        /// ReturnValue.Success = true if the username/password combo is in the database. 
        /// Success=false otherwise. Will only pass back Success, and any Errors or Messages.
        /// </returns>
        public ReturnValue<Account> GetRow(Account row)
        {
            // TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            // and the parameters would need the hashed password.
            return GetAccount(row.Username, row.Password);
        }

        /// <summary>
        /// Get a username and password and check if they are valid, asynchronously.
        /// </summary>
        /// <param name="row">Account object</param>
        /// <returns>
        /// ReturnValue.Success = true if the username/password combo is in the database. 
        /// Success=false otherwise. Will only pass back Success, and any Errors or Messages.
        /// </returns>
        public async Task<ReturnValue<Account>> GetRowAsync(Account row)
        {
            // TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            // and the parameters would need the hashed password.
            return await GetAccountAsync(row.Username, row.Password);
        }

        //****************************************************************************************************
        // InsertRow
        //****************************************************************************************************
        /// <summary>
        /// Insert a new row into the database.
        /// This method will validate the model before inserting it into the database.
        /// </summary>
        /// <param name="row">The Account object to be added to the database</param>
        /// <returns>ReturnValue object where Success=true if the row was inserted with Messages have a success message., 
        /// Success=false if there were validation errors or database errors. 
        /// </returns>
        public ReturnValue InsertRow(Account row)
        {
            //Validate the model before inserting it into the database.
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }

            //TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            // row.Password = HashPassword(row.Password);
            row.CreatedOn = DateTime.UtcNow;
            row.ModifiedOn = DateTime.UtcNow;
            row.LastLogin = DateTime.UtcNow;
            row.IsActive = true;
            row.IsLocked = false;

            //would normally use the InsertRowBase method, 
            //but this is a special case where need to catch if the username is already in use
            //return InsertRowBase(_InsertRowSQL, AccountParamsNoId(row));

            var returnValue = new ReturnValue();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = AccountParamsNoId(row);
                    connection.Open();
                    var result = connection.Execute(_InsertRowSQL, parameters);
                    if (result > 0)
                    {
                        returnValue.Success = true;
                        returnValue.Messages.Add("Account created successfully.");
                    }
                    else
                    {
                        returnValue.Messages.Add("Failed to create account.");
                    }
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627) // Unique constraint error number
                    {
                        returnValue.Messages.Add("Username already exists.");
                    }
                    else
                    {
                        returnValue.Messages.Add("Database error: " + ex.Message);
                    }
                }
                catch (Exception ex)
                {
                    returnValue.Messages.Add("Error: " + ex.Message);
                }
            }
            return returnValue;
        }

        /// <summary>
        /// Insert a new Account into the database asynchronously.
        /// </summary>
        /// <param name="row">The Account object to be inserted</param>
        /// <returns>ReturnValue object where Success=true if the row was inserted with Messages have a success message., 
        /// Success=false if there were validation errors or database errors. 
        /// </returns>
        public async Task<ReturnValue> InsertRowAsync(Account row)
        {
            //Validate the model before inserting it into the database.
            var validationResult = await _modelValidation.ValidateModelAsync(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }

            //TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            // row.Password = HashPassword(row.Password);
            row.CreatedOn = DateTime.UtcNow;
            row.ModifiedOn = DateTime.UtcNow;
            row.LastLogin = DateTime.UtcNow;
            row.IsActive = true;
            row.IsLocked = false;

            //would normally use the InsertRowBase method, 
            //but this is a special case where need to catch if the username is already in use
            //return InsertRowBase(_InsertRowSQL, AccountParamsNoId(row));

            var returnValue = new ReturnValue();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = AccountParamsNoId(row);
                    connection.Open();
                    var result = await connection.ExecuteAsync(_InsertRowSQL, parameters);
                    if (result > 0)
                    {
                        returnValue.Success = true;
                        returnValue.Messages.Add("Account created successfully.");
                    }
                    else
                    {
                        returnValue.Messages.Add("Failed to create account.");
                    }
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627) // Unique constraint error number
                    {
                        returnValue.Messages.Add("Username already exists.");
                    }
                    else
                    {
                        returnValue.Messages.Add("Database error: " + ex.Message);
                    }
                }
                catch (Exception ex)
                {
                    returnValue.Messages.Add("Error: " + ex.Message);
                }
            }
            return returnValue;
        }

        //****************************************************************************************************
        // UpdateRow
        //****************************************************************************************************
        /// <summary>
        /// Update an existing Account in the database.
        /// This method will validate the model before updating it in the database.
        /// If this is a login, then the LastLogin field needs to be updated when called.
        /// will attempt to find row by username and password, and then update the row with the new values.
        /// </summary>
        /// <param name="row">Account object to update</param>
        /// <returns>ReturnValue.Success = true when the row is updated. 
        /// Success = false if there are validation issues or database errors
        /// </returns>
        public ReturnValue UpdateRow(Account row)
        {
            //TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            var returnValue = GetRowId(row.Username, row.Password);
            if (!returnValue.Success)
            {
                return new ReturnValue { Success = false, Messages = { "Account not found." } };
            }
            return UpdateRow(returnValue.Data, row);
        }
        /// <summary>
        /// Update an existing Account in the database asynchronously.
        /// This method will validate the model before updating it in the database.
        /// If this is a login, then the LastLogin field needs to be updated when called.
        /// will attempt to find row by username and password, and then update the row with the new values.
        /// </summary>
        /// <param name="row">Account object to update</param>
        /// <returns>ReturnValue.Success = true when the row is updated. 
        /// Success = false if there are validation issues or database errors
        /// </returns>
        public async Task<ReturnValue> UpdateRowAsync(Account row)
        {
            //TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            var returnValue = await GetRowIdAsync(row.Username, row.Password);
            if (!returnValue.Success)
            {
                return new ReturnValue { Success = false, Messages = { "Account not found." } };
            }
            return await UpdateRowAsync(returnValue.Data, row);
        }
        /// <summary>
        /// Update an existing Account in the database.
        /// This method will validate the model before updating it in the database.
        /// If this is a login, then the LastLogin field needs to be updated when called.
        /// </summary>
        /// <param name="row">Account object to update row id</param>
        /// <param name="id">id of the row to be updated</param>
        /// <returns>ReturnValue.Success = true when the row is updated. 
        /// Success = false if there are validation issues or database errors
        /// </returns>
        public ReturnValue UpdateRow(int id, Account row)
        {
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            //TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            // row.Password = HashPassword(row.Password);
            row.ModifiedOn = DateTime.UtcNow;

            //would normally use the InsertRowBase method, 
            //but this is a special case where need to catch if the username is already in use
            //return InsertRowBase(_InsertRowSQL, AccountParamsNoId(row));

            var returnValue = new ReturnValue();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = AccountParamsWithId(row);
                    connection.Open();
                    var result = connection.Execute(_UpdateRowSQL, parameters);
                    if (result > 0)
                    {
                        returnValue.Success = true;
                        returnValue.Messages.Add("Account updated successfully.");
                    }
                    else
                    {
                        returnValue.Messages.Add("Failed to update account.");
                    }
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627) // Unique constraint error number
                    {
                        returnValue.Messages.Add("Username already exists.");
                    }
                    else
                    {
                        returnValue.Messages.Add("Database error: " + ex.Message);
                    }
                }
                catch (Exception ex)
                {
                    returnValue.Messages.Add("Error: " + ex.Message);
                }
            }
            return returnValue;

        }
        /// Update an existing Account in the database asynchronously.
        /// This method will validate the model before updating it in the database.
        /// If this is a login, then the LastLogin field needs to be updated when called.
        /// </summary>
        /// <param name="row">Account object to update row id</param>
        /// <param name="id">id of the row to be updated</param>
        /// <returns>ReturnValue.Success = true when the row is updated. 
        /// Success = false if there are validation issues or database errors
        /// </returns>
        public async Task<ReturnValue> UpdateRowAsync(int id, Account row)
        {
            var validationResult = await _modelValidation.ValidateModelAsync(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            //TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            // row.Password = HashPassword(row.Password);
            row.ModifiedOn = DateTime.UtcNow;
            row.Id = id;

            //would normally use the InsertRowBase method, 
            //but this is a special case where need to catch if the username is already in use
            //return InsertRowBase(_InsertRowSQL, AccountParamsNoId(row));

            var returnValue = new ReturnValue();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = AccountParamsWithId(row);
                    connection.Open();
                    var result = await connection.ExecuteAsync(_UpdateRowSQL, parameters);
                    if (result > 0)
                    {
                        returnValue.Success = true;
                        returnValue.Messages.Add("Account updated successfully.");
                    }
                    else
                    {
                        returnValue.Messages.Add("Failed to update account.");
                    }
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627) // Unique constraint error number
                    {
                        returnValue.Messages.Add("Username already exists.");
                    }
                    else
                    {
                        returnValue.Messages.Add("Database error: " + ex.Message);
                    }
                }
                catch (Exception ex)
                {
                    returnValue.Messages.Add("Error: " + ex.Message);
                }
            }
            return returnValue;
        }

        //****************************************************************************************************
        // DeleteRow
        //****************************************************************************************************
        /// <summary>
        /// Delete a row from the database.
        /// uses username and password to find the row to delete.
        /// </summary>
        /// <param name="row">row to be deleted</param>
        /// <returns>ReturnValue.Success = true if deleted, ReturnValue.Success = false and Messages and/or Errors with text.</returns>
        public ReturnValue DeleteRow(Account row)
        {
            //TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            var returnValue = GetRowId(row.Username, row.Password);
            if (!returnValue.Success)
            {
                return new ReturnValue { Success = false, Messages = { "Account not found." } };
            }
            return DeleteRow(returnValue.Data);
        }
        /// <summary>
        /// Delete a row from the database.
        /// uses username and password to find the row to delete.
        /// </summary>
        /// <param name="row">row to be deleted</param>
        /// <returns>ReturnValue.Success = true if deleted, ReturnValue.Success = false and Messages and/or Errors with text.</returns>
        public async Task<ReturnValue> DeleteRowAsync(Account row)
        {
            //TODO: password needs to be encrypted, so here it would plaintext and need to be hashed to check against the database.
            var returnValue = await GetRowIdAsync(row.Username, row.Password);
            if (!returnValue.Success)
            {
                return new ReturnValue { Success = false, Messages = { "Account not found." } };
            }
            return await DeleteRowAsync(returnValue.Data);
        }


        //****************************************************************************************************
        // Private Helper Methods
        //****************************************************************************************************
        private ReturnValue<Account> GetAccount(string username, string hashedPassword)
        {
            var returnValue = new ReturnValue<Account>();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = UsernameAndPasswordParam(username, hashedPassword);
                    var account = connection.QuerySingleOrDefault<Account>(_GetAccountByUsernameAndPassword, parameters);
                    if (account != null)
                    {
                        returnValue.Success = true;
                        returnValue.Data = account;
                    }
                    else
                    {
                        returnValue.Messages.Add("Invalid username or password.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue.Errors.Add(ex.Message);
                }
            }
            return returnValue;
        }

        private async Task<ReturnValue<Account>> GetAccountAsync(string username, string hashedPassword)
        {
            var returnValue = new ReturnValue<Account>();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = UsernameAndPasswordParam(username, hashedPassword);

                    connection.Open();
                    var account = await connection.QuerySingleOrDefaultAsync<Account>(_GetAccountByUsernameAndPassword, parameters);
                    if (account != null)
                    {
                        returnValue.Success = true;
                        returnValue.Data = account;
                    }
                    else
                    {
                        returnValue.Messages.Add("Invalid username or password.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue.Errors.Add(ex.Message);
                }
            }
            return returnValue;
        }

        private ReturnValue<int> GetRowId(string username, string hashedPassword)
        {
            var returnValue = new ReturnValue<int>();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = UsernameAndPasswordParam(username, hashedPassword);
                    connection.Open();
                    var accountId = connection.QuerySingleOrDefault<int>(_GetIdByUsernameAndPasword, parameters);
                    if (accountId > 0)
                    {
                        returnValue.Success = true;
                        returnValue.Data = accountId;
                    }
                    else
                    {
                        returnValue.Messages.Add("Invalid username or password.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue.Errors.Add(ex.Message);
                }
            }
            return returnValue;
        }

        private async Task<ReturnValue<int>> GetRowIdAsync(string username, string hashedPassword)
        {
            var returnValue = new ReturnValue<int>();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = UsernameAndPasswordParam(username, hashedPassword);
                    connection.Open();
                    var accountId = await connection.QuerySingleOrDefaultAsync<int>(_GetIdByUsernameAndPasword, parameters);
                    if (accountId > 0)
                    {
                        returnValue.Success = true;
                        returnValue.Data = accountId;
                    }
                    else
                    {
                        returnValue.Messages.Add("Invalid username or password.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue.Errors.Add(ex.Message);
                }
            }
            return returnValue;
        }

        //****************************************************************************************************
        // Private string constant sql queries
        //****************************************************************************************************
        private const string _InsertRowSQL = $@"
                                INSERT INTO {DbTableNames.ACCOUNT_TABLE} 
                                (
                                    {DbAccountTable.USERNAME}, 
                                    {DbAccountTable.PASSWORD}, 
                                    {DbAccountTable.LAST_LOGIN},
                                    {DbAccountTable.IS_ACTIVE},
                                    {DbAccountTable.IS_LOCKED},
                                    {DbCommonColumns.CREATED_ON},
                                    {DbCommonColumns.MODIFIED_ON}
                                )
                            ;"
            ;
        private const string _UpdateRowSQL = $@"
                                UPDATE {DbTableNames.ACCOUNT_TABLE} 
                                SET 
                                    {DbAccountTable.USERNAME} = @Username, 
                                    {DbAccountTable.PASSWORD} = @Password, 
                                    {DbAccountTable.LAST_LOGIN} = @LastLogin,
                                    {DbAccountTable.IS_ACTIVE} = @IsActive,
                                    {DbAccountTable.IS_LOCKED} = @IsLocked,
                                    {DbCommonColumns.CREATED_ON} = @CreatedOn,
                                    {DbCommonColumns.MODIFIED_ON} = @ModifiedOn
                                WHERE {DbCommonColumns.ID} = @Id
                            ;"
            ;
        private const string _GetIdByUsernameAndPasword = $@"
                                SELECT {DbCommonColumns.ID} 
                                FROM {DbTableNames.ACCOUNT_TABLE}
                                WHERE {DbAccountTable.USERNAME} = @Username AND
                                {DbAccountTable.PASSWORD} = @Password
                            ;"
            ;
        private const string _GetAccountByUsernameAndPassword = $@"
                                SELECT * 
                                FROM {DbTableNames.ACCOUNT_TABLE}
                                WHERE {DbAccountTable.USERNAME} = @Username AND
                                {DbAccountTable.PASSWORD} = @Password
                            ;"
            ;

        //****************************************************************************************************
        // Private DynamicParameters Helper Methods
        //****************************************************************************************************
        private DynamicParameters AccountParamsNoId(Account row)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Username", row.Username);
            parameters.Add("@Password", row.Password);
            parameters.Add("@LastLogin", row.LastLogin);
            parameters.Add("@IsActive", row.IsActive);
            parameters.Add("@IsLocked", row.IsLocked);
            parameters.Add("@CreatedOn", row.CreatedOn);
            parameters.Add("@ModifiedOn", row.ModifiedOn);
            return parameters;
        }
        private DynamicParameters AccountParamsWithId(Account row)
        {
            var parameters = AccountParamsNoId(row);
            parameters.Add("@Id", row.Id);
            return parameters;
        }
        private DynamicParameters UsernameAndPasswordParam(string username, string password)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Username", username);
            parameters.Add("@Password", password);
            return parameters;
        }
    }
}
