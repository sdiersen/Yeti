using Persistence.Migrations.Constants;
using Persistence.Models.Identity;
using Persistence.ModelValidations;
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
            TableName = DbTableNames.USER_DATA_TABLE;
        }

        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        /// <summary>
        /// Gets a UserData row from the database by id
        /// currently this method uses the id in the row parameter to get the row
        /// </summary>
        /// <param name="row">UserData object to find</param>
        /// <returns>
        /// ReturnValue.Success = true if found ReturnValue.Data will have the UserData row
        /// ReturnValue.Success = false if not found ReturnValue.Errors, ReturnValue.Messages will have the errors/messages respectively
        /// </returns>
        public ReturnValue<UserData> GetRow(UserData row)
        {
            return GetRow(row.Id);
        }
        public ReturnValue<UserData> GetRowAsTransaction(UserData row, SqlConnection connection, SqlTransaction transaction)
        {
            return GetRowAsTransaction(row.Id, connection, transaction);
        }
        /// <summary>
        /// Gets a UserData row from the database by id asynchronously
        /// currently this method uses the id in the row parameter to get the row
        /// </summary>
        /// <param name="row">UserData object to find</param>
        /// <returns>
        /// ReturnValue.Success = true if found ReturnValue.Data will have the UserData row
        /// ReturnValue.Success = false if not found ReturnValue.Errors, ReturnValue.Messages will have the errors/messages respectively
        /// </returns>
        public async Task<ReturnValue<UserData>> GetRowAsync(UserData row)
        {
            return await GetRowAsync(row.Id);
        }
        public async Task<ReturnValue<UserData>> GetRowAsTransactionAsync(UserData row, SqlConnection connection, SqlTransaction transaction)
        {
            return await GetRowAsTransactionAsync(row.Id, connection, transaction);
        }

        //****************************************************************************************************
        // InsertRow
        //****************************************************************************************************
        /// <summary>
        /// Inserts a row into the database
        /// </summary>
        /// <param name="row">The UserData object to insert</param>
        /// <returns>ReturnValue</returns>
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

            return InsertRowBase(_InsertUserDataSQL, FullUserDataParamsNoId(row));
        }
        public ReturnValue InsertRowAsTransaction(UserData row, SqlConnection connection, SqlTransaction transaction)
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
            return InsertRowBaseAsTransaction(_InsertUserDataSQL, FullUserDataParamsNoId(row), connection, transaction);
        }
        /// <summary>
        /// Inserts a UserData row into the database asynchronously
        /// </summary>
        /// <param name="row">The UserData object to insert</param>
        /// <returns>ReturnValue</returns>
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

            return await InsertRowBaseAsync(_InsertUserDataSQL, FullUserDataParamsNoId(row));
        }
        public async Task<ReturnValue> InsertRowAsTransactionAsync(UserData row, SqlConnection connection, SqlTransaction transaction)
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
            return await InsertRowBaseAsTransactionAsync(_InsertUserDataSQL, FullUserDataParamsNoId(row), connection, transaction);
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

            //do I want to catch errors here or pass them along? for now we're passing
            return UpdateRowBase(_UpdateUserDataSQL, FullUserDataParams(row));
        }
        public ReturnValue UpdateRowAsTransaction(int id, UserData row, SqlConnection connection, SqlTransaction transaction)
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
            return UpdateRowBaseAsTransaction(_UpdateUserDataSQL, FullUserDataParams(row), connection, transaction);
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

            return await UpdateRowBaseAsync(_UpdateUserDataSQL, FullUserDataParams(row));
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(int id, UserData row, SqlConnection connection, SqlTransaction transaction)
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
            return await UpdateRowBaseAsTransactionAsync(_UpdateUserDataSQL, FullUserDataParams(row), connection, transaction);
        }

        public ReturnValue UpdateRow(UserData row)
        {
            return UpdateRow(row.Id, row);
        }
        public ReturnValue UpdateRowAsTransaction(UserData row, SqlConnection connection, SqlTransaction transaction)
        {
            return UpdateRowAsTransaction(row.Id, row, connection, transaction);
        }

        public async Task<ReturnValue> UpdateRowAsync(UserData row)
        {
            return await UpdateRowAsync(row.Id, row);
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(UserData row, SqlConnection connection, SqlTransaction transaction)
        {
            return await UpdateRowAsTransactionAsync(row.Id, row, connection, transaction);
        }

        //****************************************************************************************************
        // DeleteRow
        //****************************************************************************************************
        public ReturnValue DeleteRow(UserData row)
        {
            return DeleteRow(row.Id);
        }
        public ReturnValue DeleteRowAsTransaction(UserData row, SqlConnection connection, SqlTransaction transaction)
        {
            return DeleteRowAsTransaction(row.Id, connection, transaction);
        }

        public async Task<ReturnValue> DeleteRowAsync(UserData row)
        {
            return await DeleteRowAsync(row.Id);
        }
        public async Task<ReturnValue> DeleteRowAsTransactionAsync(UserData row, SqlConnection connection, SqlTransaction transaction)
        {
            return await DeleteRowAsTransactionAsync(row.Id, connection, transaction);
        }


        //****************************************************************************************************
        // Private string constant sql queries
        //****************************************************************************************************
        private const string _InsertUserDataSQL = $@"
                            INSERT INTO {DbTableNames.USER_DATA_TABLE} 
                            (
                                {DbUserDataTable.FIRST_NAME}, 
                                {DbUserDataTable.LAST_NAME}, 
                                {DbUserDataTable.DATE_OF_BIRTH},
                                {DbCommonColumns.MODIFIED_ON},
                                {DbCommonColumns.CREATED_ON}
                            ) 
                            VALUES 
                            (
                                @FirstName, 
                                @LastMame, 
                                @DateOfBirth,
                                @ModifiedOn,
                                @CreatedOn
                            )
                        ;"
            ;

        private string _UpdateUserDataSQL = $@"
                            UPDATE {DbTableNames.USER_DATA_TABLE} 
                            SET                                 
                                {DbUserDataTable.FIRST_NAME} = @FirstName, 
                                {DbUserDataTable.LAST_NAME} = @LastName,
                                {DbUserDataTable.DATE_OF_BIRTH} = @DateOfBirth, 
                                {DbCommonColumns.CREATED_ON} = @CreatedOn,
                                {DbCommonColumns.MODIFIED_ON} = @ModifiedOn
                            WHERE {DbCommonColumns.ID} = @Id;
                        "
            ;

        //****************************************************************************************************
        // Private DynamicParameters Helper Methods
        //****************************************************************************************************
        private DynamicParameters FullUserDataParamsNoId(UserData userData)
        {
            var dp = new DynamicParameters();
            dp.Add("@FirstName", userData.FirstName);
            dp.Add("@LastName", userData.LastName);
            dp.Add("@DateOfBirth", userData.DateOfBirth);
            dp.Add("@CreatedOn", userData.CreatedOn);
            dp.Add("@ModifiedOn", userData.ModifiedOn);
            return dp;
        }

        private DynamicParameters FullUserDataParams(UserData userData)
        {
            var dp = FullUserDataParamsNoId(userData);
            dp.Add("@Id", userData.Id);
            return dp;
        }

        //****************************************************************************************************
        // Private Helper Methods
        //****************************************************************************************************

    }
}