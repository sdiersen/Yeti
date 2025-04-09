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
        private readonly IDbServicesInterface<AccountRole> _accountRoleService; //needed to add an entry into Account_Role when creating an account and removing when deleting an account
        public AccountServices(
            ILogger<AccountServices> logger,
            IConfiguration configuration,
            IModelValidation<Account> modelValidation,
            IDbServicesInterface<AccountRole> accountRoleService)
            : base(logger, configuration, modelValidation)
        {
            TableName = DbTableNames.ACCOUNT_TABLE;
            _accountRoleService = accountRoleService;
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
            // TODO: Add in an ecryption library to hash passwords. (to become a NuGet package)
            // TODO: password needs to be encrypted, so here it would be plaintext and need to be hashed to check against the database.
            // and the parameters would need the hashed password.
            var returnValue = new ReturnValue<Account>();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = UsernameAndPasswordParam(row.Username, row.Password);
                    var account = connection.QuerySingleOrDefault<Account>(_GetAccountByUsernameAndPassword, parameters);
                    if (account != null)
                    {
                        returnValue.Success = true;
                        returnValue.Data = account;
                    }
                    else
                    {
                        returnValue.AddMessage("database", "Invalid username or password.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue.AddError("database", ex.Message);
                }
            }
            return returnValue;
        }
        /// <summary>
        /// Get the Account row by username and password, using a transaction.
        /// </summary>
        /// <param name="row">Account object holding the username and password to find a row in the database</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>
        /// ReturnValue.Success = true if the username/password combo is in the database. 
        /// Success=false otherwise. Will only pass back Success, and any Errors or Messages.
        /// </returns>
        public ReturnValue<Account> GetRowAsTransaction(Account row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = new ReturnValue<Account>();
            try
            {
                var parameters = UsernameAndPasswordParam(row.Username, row.Password);
                var account = connection.QuerySingleOrDefault<Account>(_GetAccountByUsernameAndPassword, parameters, transaction);
                if (account != null)
                {
                    returnValue.Success = true;
                    returnValue.Data = account;
                }
                else
                {
                    returnValue.AddMessage("database", "Invalid username or password.");
                }
            }
            catch (Exception ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            return returnValue;
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
            var returnValue = new ReturnValue<Account>();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var parameters = UsernameAndPasswordParam(row.Username, row.Password);

                    connection.Open();
                    var account = await connection.QuerySingleOrDefaultAsync<Account>(_GetAccountByUsernameAndPassword, parameters);
                    if (account != null)
                    {
                        returnValue.Success = true;
                        returnValue.Data = account;
                    }
                    else
                    {
                        returnValue.AddMessage("database", "Invalid username or password.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue.AddError("database", ex.Message);
                }
            }
            return returnValue;
        }
        /// <summary>
        /// Get the Account row by username and password, using a transaction asynchronously.
        /// </summary>
        /// <param name="row">Account object holding the username and password to find a row in the database</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>
        /// ReturnValue.Success = true if the username/password combo is in the database. 
        /// Success=false otherwise. Will only pass back Success, and any Errors or Messages.
        /// </returns>
        public async Task<ReturnValue<Account>> GetRowAsTransactionAsync(Account row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = new ReturnValue<Account>();
            try
            {
                var parameters = UsernameAndPasswordParam(row.Username, row.Password);
                var account = await connection.QuerySingleOrDefaultAsync<Account>(_GetAccountByUsernameAndPassword, parameters, transaction);
                if (account != null)
                {
                    returnValue.Success = true;
                    returnValue.Data = account;
                }
                else
                {
                    returnValue.AddMessage("database", "Invalid username or password.");
                }
            }
            catch (Exception ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            return returnValue;
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

            row = SetCreationValues(row);

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
                    var result = connection.QuerySingle<int>(_InsertRowSQL, parameters);
                    if (result > 0)
                    {
                        returnValue.Success = true;
                        returnValue.AddMessage("database", "Account created successfully.");
                    }
                    else
                    {
                        returnValue.AddMessage("database", "Failed to create account.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue = HandleModifyExceptions(ex, returnValue);
                }
            }
            return returnValue;
        }
        /// <summary>
        /// Insert a new row into the database using a transaction.
        /// </summary>
        /// <param name="row">The Account object to be added to the database</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>ReturnValue object where Success=true if the row was inserted with Messages have a success message., 
        /// Success=false if there were validation errors or database errors. 
        /// </returns>
        public ReturnValue InsertRowAsTransaction(Account row, SqlConnection connection, SqlTransaction transaction)
        {
            //Validate the model before inserting it into the database.
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }

            row = SetCreationValues(row);

            var returnValue = new ReturnValue();
            try
            {
                var parameters = AccountParamsNoId(row);
                var result = connection.QuerySingle<int>(_InsertRowSQL, parameters, transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                    returnValue.AddMessage("database", "Account created successfully.");
                }
                else
                {
                    returnValue.AddMessage("database", "Failed to create account.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
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

            row = SetCreationValues(row);

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
                    var result = await connection.QuerySingleAsync<int>(_InsertRowSQL, parameters);
                    if (result > 0)
                    {
                        //add in a role for the user in the Account_Role Table for now assume RoleNumber is 2 (User)
                        var accountRole = new AccountRole
                        {
                            AccountId = result,
                            RoleId = 2
                        };
                        var insertResult = _accountRoleService.InsertRowAsync(accountRole);
                        returnValue.AddMessageRange(insertResult.Result.Messages);
                        returnValue.AddErrorRange(insertResult.Result.Errors);

                        returnValue.Success = insertResult.Result.Success;
                        if (returnValue.Success)
                        {
                            returnValue.AddMessage("account", "Account created successfully.");
                        }
                        else
                        {
                            //TODO: add some sort of rollback if the _accountRoleService.InsertRowAsync(accountRole); doesn't work

                            returnValue.AddMessage("account", "Failed to create account.");
                        }
                    }
                    else
                    {
                        returnValue.AddMessage("account", "Failed to create account.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue = HandleModifyExceptions(ex, returnValue);
                }
            }
            return returnValue;
        }
        /// <summary>
        /// Insert a new Account into the database asynchronously using a transaction.
        /// </summary>
        /// <param name="row">The Account object to be added to the database</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>ReturnValue object where Success=true if the row was inserted with Messages have a success message., 
        /// Success=false if there were validation errors or database errors. 
        /// </returns>n"></param>
        /// <returns></returns>
        public async Task<ReturnValue> InsertRowAsTransactionAsync(Account row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = await _modelValidation.ValidateModelAsync(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }

            var returnValue = new ReturnValue();
            try
            {
                row = SetCreationValues(row);

                var parameters = AccountParamsNoId(row);
                var result = await connection.QuerySingleAsync<int>(_InsertRowSQL, parameters, transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                    returnValue.AddMessage("database", "Account created successfully.");
                }
                else
                {
                    returnValue.AddMessage("database", "Failed to create account.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
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
            var resultValue = GetRowId(row.Username, row.Password);
            if (!resultValue.Success)
            {
                var returnValue = new ReturnValue();
                returnValue.AddMessage("database", "Account not found.");
                return returnValue;
            }
            return UpdateRow(resultValue.Data, row);
        }
        /// <summary>
        /// Update an existing Account in the database using a transaction.
        /// </summary>
        /// <param name="row">The Account object to be updated in the database</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>ReturnValue.Success = true when the row is updated. 
        /// Success = false if there are validation issues or database errors
        /// </returns>
        public ReturnValue UpdateRowAsTransaction(Account row, SqlConnection connection, SqlTransaction transaction)
        {
            var resultValue = GetRowIdAsTransaction(row.Username, row.Password, connection, transaction);
            if (!resultValue.Success)
            {
                var returnValue = new ReturnValue();
                returnValue.AddMessage("database", "Account not found.");
                return returnValue;
            }
            return UpdateRowAsTransaction(resultValue.Data, row, connection, transaction);
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
            var resultValue = await GetRowIdAsync(row.Username, row.Password);
            if (!resultValue.Success)
            {
                var returnValue = new ReturnValue();
                returnValue.AddMessage("database", "Account not found.");
                return returnValue;
            }
            return await UpdateRowAsync(resultValue.Data, row);
        }
        /// <summary>
        /// Update an existing Account in the database asynchronously using a transaction.
        /// </summary>
        /// <param name="row">The Account object to be updated in the database</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>ReturnValue.Success = true when the row is updated. 
        /// Success = false if there are validation issues or database errors
        /// </returns>
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(Account row, SqlConnection connection, SqlTransaction transaction)
        {
            var resultValue = await GetRowIdAsTransactionAsync(row.Username, row.Password, connection, transaction);
            if (!resultValue.Success)
            {
                var returnValue = new ReturnValue();
                returnValue.AddMessage("database", "Account not found.");
                return returnValue;
            }
            return await UpdateRowAsTransactionAsync(resultValue.Data, row, connection, transaction);
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
                        returnValue.AddMessage("database", "Account updated successfully.");
                    }
                    else
                    {
                        returnValue.AddMessage("database", "Failed to update account.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue = HandleModifyExceptions(ex, returnValue);
                }
            }
            return returnValue;

        }
        /// <summary>
        /// Update an existing Account in the database using a transaction.
        /// </summary>
        /// <param name="row">Account object to update row id</param>
        /// <param name="id">id of the row to be updated</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>ReturnValue.Success = true when the row is updated. 
        /// Success = false if there are validation issues or database errors
        /// </returns>
        public ReturnValue UpdateRowAsTransaction(int id, Account row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = _modelValidation.ValidateModel(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            row.ModifiedOn = DateTime.UtcNow;
            var returnValue = new ReturnValue();
            try
            {
                var parameters = AccountParamsWithId(row);
                var result = connection.Execute(_UpdateRowSQL, parameters, transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                    returnValue.AddMessage("database", "Account updated successfully.");
                }
                else
                {
                    returnValue.AddMessage("database", "Failed to update account.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
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
                        returnValue.AddMessage("database", "Account updated successfully.");
                    }
                    else
                    {
                        returnValue.AddMessage("database", "Failed to update account.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue = HandleModifyExceptions(ex, returnValue);
                }
            }
            return returnValue;
        }
        /// <summary>
        /// Update an existing Account in the database asynchronously using a transaction.
        /// </summary>
        /// <param name="row">Account object to update row id</param>
        /// <param name="id">id of the row to be updated</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>ReturnValue.Success = true when the row is updated. 
        /// Success = false if there are validation issues or database errors
        /// </returns>
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(int id, Account row, SqlConnection connection, SqlTransaction transaction)
        {
            var validationResult = await _modelValidation.ValidateModelAsync(row);
            if (!validationResult.Success)
            {
                return validationResult;
            }
            row.ModifiedOn = DateTime.UtcNow;
            var returnValue = new ReturnValue();
            try
            {
                var parameters = AccountParamsWithId(row);
                var result = await connection.ExecuteAsync(_UpdateRowSQL, parameters, transaction);
                if (result > 0)
                {
                    returnValue.Success = true;
                    returnValue.AddMessage("database", "Account updated successfully.");
                }
                else
                {
                    returnValue.AddMessage("database", "Failed to update account.");
                }
            }
            catch (Exception ex)
            {
                returnValue = HandleModifyExceptions(ex, returnValue);
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
                var rv = new ReturnValue();
                rv.AddMessage("database", "Account not found.");
                return rv;
            }
            return DeleteRow(returnValue.Data);
        }
        /// <summary>
        /// Delete a row from the database using a transaction.
        /// </summary>
        /// <param name="row">row to be deleted</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>ReturnValue.Success = true if deleted, ReturnValue.Success = false and Messages and/or Errors with text.</returns>
        public ReturnValue DeleteRowAsTransaction(Account row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = GetRowIdAsTransaction(row.Username, row.Password, connection, transaction);
            if (!returnValue.Success)
            {
                var rv = new ReturnValue();
                rv.AddMessage("database", "Account not found.");
                return rv;
            }
            return DeleteRowAsTransaction(returnValue.Data, connection, transaction);
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
            var resultValue = await GetRowIdAsync(row.Username, row.Password);
            if (!resultValue.Success)
            {
                var returnValue = new ReturnValue();
                returnValue.AddMessage("database", "Account not found.");
                return returnValue;
            }
            return await DeleteRowAsync(resultValue.Data);
        }
        /// <summary>
        /// Delete a row from the database asynchronously using a transaction.
        /// </summary>
        /// <param name="row">row to be deleted</param>
        /// <param name="connection">the SqlConnection to use in the query</param>
        /// <param name="transaction">the SqlTransaction that wraps this query</param>
        /// <returns>ReturnValue.Success = true if deleted, ReturnValue.Success = false and Messages and/or Errors with text.</returns>
        public async Task<ReturnValue> DeleteRowAsTransactionAsync(Account row, SqlConnection connection, SqlTransaction transaction)
        {
            var resultValue = await GetRowIdAsTransactionAsync(row.Username, row.Password, connection, transaction);
            if (!resultValue.Success)
            {
                var returnValue = new ReturnValue();
                returnValue.AddMessage("database", "Account not found.");
                return returnValue;
            }
            return await DeleteRowAsTransactionAsync(resultValue.Data, connection, transaction);
        }


        //****************************************************************************************************
        // Private Helper Methods
        //****************************************************************************************************

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
                        returnValue.AddMessage("database", "Invalid username or password.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue.AddError("database", ex.Message);
                }
            }
            return returnValue;
        }
        private ReturnValue<int> GetRowIdAsTransaction(string username, string hashedPassword, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = new ReturnValue<int>();
            try
            {
                var parameters = UsernameAndPasswordParam(username, hashedPassword);
                var accountId = connection.QuerySingleOrDefault<int>(_GetIdByUsernameAndPasword, parameters, transaction);
                if (accountId > 0)
                {
                    returnValue.Success = true;
                    returnValue.Data = accountId;
                }
                else
                {
                    returnValue.AddMessage("database", "Invalid username or password.");
                }
            }
            catch (Exception ex)
            {
                returnValue.AddError("database", ex.Message);
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
                        returnValue.AddMessage("database", "Invalid username or password.");
                    }
                }
                catch (Exception ex)
                {
                    returnValue.AddError("database", ex.Message);
                }
            }
            return returnValue;
        }
        private async Task<ReturnValue<int>> GetRowIdAsTransactionAsync(string username, string hashedPassword, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = new ReturnValue<int>();
            try
            {
                var parameters = UsernameAndPasswordParam(username, hashedPassword);
                var accountId = await connection.QuerySingleOrDefaultAsync<int>(_GetIdByUsernameAndPasword, parameters, transaction);
                if (accountId > 0)
                {
                    returnValue.Success = true;
                    returnValue.Data = accountId;
                }
                else
                {
                    returnValue.AddMessage("database", "Invalid username or password.");
                }
            }
            catch (Exception ex)
            {
                returnValue.AddError("database", ex.Message);
            }
            return returnValue;
        }

        private static Account SetCreationValues(Account row)
        {
            row.CreatedOn = DateTime.UtcNow;
            row.ModifiedOn = DateTime.UtcNow;
            row.LastLogin = DateTime.UtcNow;
            row.IsActive = true;
            row.IsLocked = false;
            return row;
        }

        private static ReturnValue HandleModifyExceptions(Exception ex, ReturnValue returnValue)
        {
            switch(ex)
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
                                OUTPUT INSERTED.{DbCommonColumns.ID}
                                VALUES 
                                (
                                    @Username, 
                                    @Password, 
                                    @LastLogin,
                                    @IsActive,
                                    @IsLocked,
                                    @CreatedOn,
                                    @ModifiedOn
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
        private static DynamicParameters AccountParamsNoId(Account row)
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
        private static DynamicParameters AccountParamsWithId(Account row)
        {
            var parameters = AccountParamsNoId(row);
            parameters.Add("@Id", row.Id);
            return parameters;
        }
        private static DynamicParameters UsernameAndPasswordParam(string username, string password)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@Username", username);
            parameters.Add("@Password", password);
            return parameters;
        }
    }
}
