using Dapper;
using ErrorHandling;
using Microsoft.Data.SqlClient;
using Persistence;
using Persistence.Migrations.Constants;
using Persistence.Models.Transaction;
using Persistence.ModelValidations;

namespace backend.Services.Transaction
{
    public class CategoryServices : DbBaseLayer<CategoryServices, Category>, IDbServicesInterface<Category>
    {
        public CategoryServices(
            ILogger<CategoryServices> logger,
            IConfiguration configuration,
            IModelValidation<Category> modelValidation)
            : base(logger, configuration, modelValidation)
        {
        }

        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        public ReturnValue<Category> GetRow(Category row)
        {
            return GetRow(row.Id);
        }
        public ReturnValue<Category> GetRowAsTransaction(Category row, SqlConnection connection, SqlTransaction transaction)
        {
            return GetRowAsTransaction(row.Id, connection, transaction);
        }

        public async Task<ReturnValue<Category>> GetRowAsync(Category row)
        {
            return await GetRowAsync(row.Id);
        }
        public async Task<ReturnValue<Category>> GetRowAsTransactionAsync(Category row, SqlConnection connection, SqlTransaction transaction)
        {
            return await GetRowAsTransactionAsync(row.Id, connection, transaction);
        }

        //****************************************************************************************************
        // InsertRow
        //****************************************************************************************************
        public ReturnValue InsertRow(Category row)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            return InsertRowBase(_InsertRowSQL, FullCategoryParamsNoId(row));
        }
        public ReturnValue InsertRowAsTransaction(Category row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;
            return InsertRowBaseAsTransaction(_InsertRowSQL, FullCategoryParamsNoId(row), connection, transaction);
        }

        public async Task<ReturnValue> InsertRowAsync(Category row)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            return await InsertRowBaseAsync(_InsertRowSQL, FullCategoryParamsNoId(row));
        }
        public async Task<ReturnValue> InsertRowAsTransactionAsync(Category row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;
            return await InsertRowBaseAsTransactionAsync(_InsertRowSQL, FullCategoryParamsNoId(row), connection, transaction);
        }

        //****************************************************************************************************
        // UpdateRow
        //****************************************************************************************************
        public ReturnValue UpdateRow(int id, Category row)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.ModifiedOn = DateTime.Now;
            return UpdateRowBase(_UpdateRowSWL, FullCategoryParams(row));
        }
        public ReturnValue UpdateRowAsTransaction(int id, Category row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.ModifiedOn = DateTime.Now;
            return UpdateRowBaseAsTransaction(_UpdateRowSWL, FullCategoryParams(row), connection, transaction);
        }

        public ReturnValue UpdateRow(Category row)
        {
            return UpdateRow(row.Id, row);
        }
        public ReturnValue UpdateRowAsTransaction(Category row, SqlConnection connection, SqlTransaction transaction)
        {
            return UpdateRowAsTransaction(row.Id, row, connection, transaction);
        }

        public async Task<ReturnValue> UpdateRowAsync(int id, Category row)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.ModifiedOn = DateTime.Now;
            return await UpdateRowBaseAsync(_UpdateRowSWL, FullCategoryParams(row));
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(int id, Category row, SqlConnection connection, SqlTransaction transaction)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.ModifiedOn = DateTime.Now;
            return await UpdateRowBaseAsTransactionAsync(_UpdateRowSWL, FullCategoryParams(row), connection, transaction);
        }

        public async Task<ReturnValue> UpdateRowAsync(Category row)
        {
            return await UpdateRowAsync(row.Id, row);
        }
        public async Task<ReturnValue> UpdateRowAsTransactionAsync(Category row, SqlConnection connection, SqlTransaction transaction)
        {
            return await UpdateRowAsTransactionAsync(row.Id, row, connection, transaction);
        }

        //****************************************************************************************************
        // DeleteRow
        //****************************************************************************************************
        public ReturnValue DeleteRow(Category row)
        {
            return DeleteRow(row.Id);
        }
        public ReturnValue DeleteRowAsTransaction(Category row, SqlConnection connection, SqlTransaction transaction)
        {
            return DeleteRowAsTransaction(row.Id, connection, transaction);
        }

        public async Task<ReturnValue> DeleteRowAsync(Category row)
        {
            return await DeleteRowAsync(row.Id);
        }
        public async Task<ReturnValue> DeleteRowAsTransactionAsync(Category row, SqlConnection connection, SqlTransaction transaction)
        {
            return await DeleteRowAsTransactionAsync(row.Id, connection, transaction);
        }

        //****************************************************************************************************
        // Private string constant sql queries
        //****************************************************************************************************
        private const string _InsertRowSQL = @$"
            INSERT INTO {DbTableNames.CATEGORY_TABLE}
            (
                {DbCategoryTable.NAME},
                {DbCategoryTable.DESCRIPTION},
                {DbCategoryTable.CREATED_ON},
                {DbCategoryTable.MODIFIED_ON}    
            )
            VALUES
            (
                @Name,
                @Description,
                @CreatedOn,
                @ModifiedOn
            );
        ";

        private const string _UpdateRowSWL = @$"
            UPDATE {DbTableNames.CATEGORY_TABLE}
            SET
                {DbCategoryTable.NAME} = @Name,
                {DbCategoryTable.DESCRIPTION} = @Description,
                {DbCategoryTable.MODIFIED_ON} = @ModifiedOn
            WHERE
                {DbCategoryTable.ID} = @Id;
        ";

        //****************************************************************************************************
        // Private DynamicParameters Helper Methods
        //****************************************************************************************************
        private DynamicParameters FullCategoryParamsNoId(Category category)
        {
            var dp = new DynamicParameters();
            dp.Add("@Name", category.Name);
            dp.Add("@Description", category.Description);
            dp.Add("@CreatedOn", category.CreatedOn);
            dp.Add("@ModifiedOn", category.ModifiedOn);
            return dp;
        }

        private DynamicParameters FullCategoryParams(Category category)
        {
            var dp = FullCategoryParamsNoId(category);
            dp.Add("@Id", category.Id);
            return dp;
        }
    }
}