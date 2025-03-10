using backend.Persistence.Migrations.Constants;
using backend.Persistence.Models.Identity;
using backend.Persistence.ModelValidations;
using Dapper;
using ErrorHandling;
using Microsoft.Data.SqlClient;
using Persistence;
namespace backend.Services.Identity
{
    public class UserDataServices : DbBaseLayer<UserDataServices, UserData>, IDbServicesInterface<UserData>
    {
        public UserDataServices(
            ILogger<UserDataServices> logger,
            IConfiguration configuration,
            IModelValidation<UserData> modelValidation)
            : base(logger, configuration, modelValidation)
        {
        }

        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        public ReturnValue<UserData> GetRow(UserData row)
        {
            try
            {
                int id = FindIdByUsernameAndEmail(row.Username, row.Email);
                return GetRow(id);
            }
            catch (Exception e)
            {
                return new ReturnValue<UserData>
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by username and email" }
                };
            }
        }

        public async Task<ReturnValue<UserData>> GetRowAsync(UserData row)
        {
            try
            {
                int id = FindIdByUsernameAndEmail(row.Username, row.Email);
                return await GetRowAsync(id);
            }
            catch (Exception e)
            {
                return new ReturnValue<UserData>
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by username and email" }
                };
            }
        }

        //****************************************************************************************************
        // InsertRow
        //****************************************************************************************************
        public ReturnValue InsertRow(UserData row)
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
                            INSERT INTO {DbTableNames.USER_DATA_TABLE} 
                            (
                                {DbUserDataTable.MODIFIED_ON},
                                {DbUserDataTable.CREATED_ON},
                                {DbUserDataTable.USERNAME}, 
                                {DbUserDataTable.EMAIL}, 
                                {DbUserDataTable.PASSWORD}
                            ) 
                            VALUES 
                            (
                                @ModifiedOn,
                                @CreatedOn,
                                @Username, 
                                @Email, 
                                @Password
                            )
                        ;";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("@Username", row.Username);
            parameters.Add("@Email", row.Email);
            parameters.Add("@Password", row.Password);
            parameters.Add("@CreatedOn", row.CreatedOn);
            parameters.Add("@ModifiedOn", row.ModifiedOn);
            //execute the query
            //do I want to catch errors here or pass them along? for now we're passing
            return InsertRowBase(sql, parameters);
        }

        public async Task<ReturnValue> InsertRowAsync(UserData row)
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
                            INSERT INTO {DbTableNames.USER_DATA_TABLE} 
                            (
                                {DbUserDataTable.MODIFIED_ON},
                                {DbUserDataTable.CREATED_ON},
                                {DbUserDataTable.USERNAME}, 
                                {DbUserDataTable.EMAIL}, 
                                {DbUserDataTable.PASSWORD}
                            ) 
                            VALUES 
                            (
                                @ModifiedOn,
                                @CreatedOn,
                                @Username, 
                                @Email, 
                                @Password
                            )
                        ;";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("@Username", row.Username);
            parameters.Add("@Email", row.Email);
            parameters.Add("@Password", row.Password);
            parameters.Add("@CreatedOn", row.CreatedOn);
            parameters.Add("@ModifiedOn", row.ModifiedOn);
            //execute the query
            return await InsertRowBaseAsync(sql, parameters);
        }

        //****************************************************************************************************
        // UpdateRow
        //****************************************************************************************************
        public ReturnValue UpdateRow(int id, UserData row)
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
                            UPDATE {DbTableNames.USER_DATA_TABLE} 
                            SET 
                                {DbUserDataTable.MODIFIED_ON} = @ModifiedOn,
                                {DbUserDataTable.USERNAME} = @Username, 
                                {DbUserDataTable.EMAIL} = @Email, 
                                {DbUserDataTable.PASSWORD} = @Password 
                            WHERE {DbUserDataTable.ID} = @Id;
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            parameters.Add("@Username", row.Username);
            parameters.Add("@Email", row.Email);
            parameters.Add("@Password", row.Password);
            parameters.Add("@ModifiedOn", row.ModifiedOn);
            //execute the query
            //do I want to catch errors here or pass them along? for now we're passing
            return UpdateRowBase(sql, parameters);
        }

        public async Task<ReturnValue> UpdateRowAsync(int id, UserData row)
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
                            UPDATE {DbTableNames.USER_DATA_TABLE} 
                            SET 
                                {DbUserDataTable.MODIFIED_ON} = @ModifiedOn,
                                {DbUserDataTable.USERNAME} = @Username, 
                                {DbUserDataTable.EMAIL} = @Email, 
                                {DbUserDataTable.PASSWORD} = @Password 
                            WHERE {DbUserDataTable.ID} = @Id;
                        ";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            parameters.Add("@Username", row.Username);
            parameters.Add("@Email", row.Email);
            parameters.Add("@Password", row.Password);
            parameters.Add("@ModifiedOn", row.ModifiedOn);
            //execute the query
            return await UpdateRowBaseAsync(sql, parameters);
        }

        public ReturnValue UpdateRow(UserData row)
        {
            try
            {
                int id = FindIdByUsernameAndEmail(row.Username, row.Email);
                return UpdateRow(id, row);
            }
            catch (Exception e)
            {
                return new ReturnValue
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by username and email" }
                };
            }


        }

        public async Task<ReturnValue> UpdateRowAsync(UserData row)
        {
            try
            {
                int id = FindIdByUsernameAndEmail(row.Username, row.Email);
                return await UpdateRowAsync(id, row);
            }
            catch (Exception e)
            {
                return new ReturnValue
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by username and email" }
                };
            }
        }

        //****************************************************************************************************
        // DeleteRow
        //****************************************************************************************************
        public ReturnValue DeleteRow(UserData row)
        {
            try
            {
                int id = FindIdByUsernameAndEmail(row.Username, row.Email);
                return DeleteRow(id);
            }
            catch (Exception e)
            {
                return new ReturnValue
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by username and email" }
                };
            }
        }

        public async Task<ReturnValue> DeleteRowAsync(UserData row)
        {
            try
            {
                int id = FindIdByUsernameAndEmail(row.Username, row.Email);
                return await DeleteRowAsync(id);
            }
            catch (Exception e)
            {
                return new ReturnValue
                {
                    Success = false,
                    Errors = new List<string> { e.Message },
                    Messages = new List<string> { "Error finding id by username and email" }
                };
            }
        }

        //****************************************************************************************************
        // Private Helper Methods
        //****************************************************************************************************
        private int FindIdByUsernameAndEmail(string username, string email)
        {
            int id = -1;

            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    var sql = "SELECT Id FROM UserData WHERE Username = @Username AND Email = @Email;";
                    var parameters = new DynamicParameters();
                    parameters.Add("@Username", username);
                    parameters.Add("@Email", email);
                    id = connection.QueryFirstOrDefault<int>(sql, parameters);
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