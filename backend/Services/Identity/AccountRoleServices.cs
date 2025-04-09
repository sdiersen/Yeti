using Dapper;
using ErrorHandling;
using Microsoft.Data.SqlClient;
using Persistence;
using Persistence.Migrations.Constants;
using Persistence.Models.Identity;
using Persistence.ModelValidations;

namespace backend.Services.Identity
{
    public class AccountRoleServices : DbBaseLayer<AccountRoleServices, AccountRole>, IDbServicesInterface<AccountRole>
    {
        public AccountRoleServices(
            ILogger<AccountRoleServices> logger,
            IConfiguration configuration,
            IModelValidation<AccountRole> modelValidation)
            : base(logger, configuration, modelValidation)
        {
            TableName = DbTableNames.ACCOUNT_ROLE_TABLE;
        }

        //**************************************************************************
        // GetRow
        //**************************************************************************
        public ReturnValue<AccountRole> GetRow(AccountRole row)
        {
            return GetRow(row.Id);
        }
        public ReturnValue<AccountRole> GetRowAsTransaction(AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            return GetRowAsTransaction(row.Id, connection, transaction);
        }

        public async Task<ReturnValue<AccountRole>> GetRowAsync(AccountRole row)
        {
            return await GetRowAsync(row.Id);
        }
        public async Task<ReturnValue<AccountRole>> GetRowAsTransactionAsync(AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            return await GetRowAsTransactionAsync(row.Id, connection, transaction);
        }


        //****************************************************************************
        // InsertRow
        //****************************************************************************
        public ReturnValue InsertRow(AccountRole row)
        {
            var returnValidation = _modelValidation.ValidateModel(row);
            if (!returnValidation.Success)
            {
                return returnValidation;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            return InsertRowBase(_InsertRowSQL, FullAccountRoleParamsNoId(row));
        }
        public ReturnValue InsertRowAsTransaction(AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValidation = _modelValidation.ValidateModel(row);
            if (!returnValidation.Success)
            {
                return returnValidation;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;
            return InsertRowBaseAsTransaction(_InsertRowSQL, FullAccountRoleParamsNoId(row), connection, transaction);
        }

        public async Task<ReturnValue> InsertRowAsync(AccountRole row)
        {
            var returnValidation = _modelValidation.ValidateModel(row);
            if (!returnValidation.Success)
            {
                return returnValidation;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            return await InsertRowBaseAsync(_InsertRowSQL, FullAccountRoleParamsNoId(row));
        }
        public async Task<ReturnValue> InsertRowAsTransactionAsync(AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValidation = _modelValidation.ValidateModel(row);
            if (!returnValidation.Success)
            {
                return returnValidation;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;
            return await InsertRowBaseAsTransactionAsync(_InsertRowSQL, FullAccountRoleParamsNoId(row), connection, transaction);
        }

        //****************************************************************************
        // UpdateRow
        //****************************************************************************
        public ReturnValue UpdateRow(AccountRole row)
        {
            var returnValidation = _modelValidation.ValidateModel(row);
            if (!returnValidation.Success)
            {
                return returnValidation;
            }
            row.ModifiedOn = DateTime.Now;

            return UpdateRowBase(_UpdateRowSQL, FullAccountRoleParams(row));
        }
        public ReturnValue UpdateRowAsTransaction(AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValidation = _modelValidation.ValidateModel(row);
            if (!returnValidation.Success)
            {
                return returnValidation;
            }
            row.ModifiedOn = DateTime.Now;
            return UpdateRowBaseAsTransaction(_UpdateRowSQL, FullAccountRoleParams(row), connection, transaction);
        }
        public async Task<ReturnValue> UpdateRowAsync(AccountRole row)
        {
            var returnValidation = _modelValidation.ValidateModel(row);
            if (!returnValidation.Success)
            {
                return returnValidation;
            }
            row.ModifiedOn = DateTime.Now;

            return await UpdateRowBaseAsync(_UpdateRowSQL, FullAccountRoleParams(row));
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValidation = _modelValidation.ValidateModel(row);
            if (!returnValidation.Success)
            {
                return returnValidation;
            }
            row.ModifiedOn = DateTime.Now;
            return await UpdateRowBaseAsTransactionAsync(_UpdateRowSQL, FullAccountRoleParams(row), connection, transaction);
        }
        public ReturnValue UpdateRow(int id, AccountRole row)
        {
            row.Id = id;
            return UpdateRow(row);
        }
        //TODO - evaluate removiing Update methods that take an id and row, potentally require the id to be in the row
        public ReturnValue UpdateRowAsTransaction(int id, AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            row.Id = id;
            return UpdateRowAsTransaction(row, connection, transaction);
        }
        public async Task<ReturnValue> UpdateRowAsync(int id, AccountRole row)
        {
            row.Id = id;
            return await UpdateRowAsync(row);
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(int id, AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            row.Id = id;
            return await UpdateRowAsTransactionAsync(row, connection, transaction);
        }

        //****************************************************************************
        // DeleteRow
        //****************************************************************************
        public ReturnValue DeleteRow(AccountRole row)
        {
            return DeleteRow(row.Id);
        }
        public ReturnValue DeleteRowAsTransaction(AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            return DeleteRowAsTransaction(row.Id, connection, transaction);
        }
        public async Task<ReturnValue> DeleteRowAsync(AccountRole row)
        {
            return await DeleteRowAsync(row.Id);
        }
        public async Task<ReturnValue> DeleteRowAsTransactionAsync(AccountRole row, SqlConnection connection, SqlTransaction transaction)
        {
            return await DeleteRowAsTransactionAsync(row.Id, connection, transaction);
        }
        //****************************************************************************
        // Private string constant sql queries
        //****************************************************************************
        private const string _InsertRowSQL = $@"
                                    INSERT INTO {DbTableNames.ACCOUNT_ROLE_TABLE} 
                                    (
                                        {DbAccountRoleTable.ACCOUNT_ID}, 
                                        {DbAccountRoleTable.ROLE_ID}, 
                                        {DbCommonColumns.CREATED_ON},
                                        {DbCommonColumns.MODIFIED_ON} 
                                    )
                                    VALUES 
                                    (
                                        @AccountId, 
                                        @RoleId, 
                                        @CreatedOn, 
                                        @ModifiedOn
                                    )
                                ;"
                            ;

        private const string _UpdateRowSQL = $@"
                                    UPDATE {DbTableNames.ACCOUNT_ROLE_TABLE} 
                                    SET 
                                        {DbAccountRoleTable.ACCOUNT_ID} = @AccountId, 
                                        {DbAccountRoleTable.ROLE_ID} = @RoleId, 
                                        {DbCommonColumns.CREATED_ON} = @CreatedOn, 
                                        {DbCommonColumns.MODIFIED_ON} = @ModifiedOn
                                    WHERE {DbCommonColumns.ID} = @Id
                                ;"
                            ;
        //****************************************************************************
        // private DynamicParameters Helper methods
        //****************************************************************************
        private static DynamicParameters FullAccountRoleParamsNoId(AccountRole row)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@AccountId", row.AccountId);
            parameters.Add("@RoleId", row.RoleId);
            parameters.Add("@CreatedOn", row.CreatedOn);
            parameters.Add("@ModifiedOn", row.ModifiedOn);

            return parameters;
        }
        private static DynamicParameters FullAccountRoleParams(AccountRole row)
        {
            var parameters = FullAccountRoleParamsNoId(row);
            parameters.Add("@Id", row.Id);

            return parameters;
        }
        //****************************************************************************
        // private Helper methods
        //****************************************************************************
    }
}