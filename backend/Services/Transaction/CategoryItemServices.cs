using Dapper;
using ErrorHandling;
using Persistence;
using Persistence.Migrations.Constants;
using Persistence.Models.Transaction;
using Persistence.ModelValidations;

namespace backend.Services.Transaction
{
    public class CategoryItemServices : DbBaseLayer<CategoryItemServices, CategoryItem>,
                                                    IDbServicesInterface<CategoryItem>
    {
        public CategoryItemServices(
            ILogger<CategoryItemServices> logger,
            IConfiguration configuration,
            IModelValidation<CategoryItem> modelValidation)
            : base(logger, configuration, modelValidation)
        {
        }

        //****************************************************************************************************
        // GetRow
        //****************************************************************************************************
        public ReturnValue<CategoryItem> GetRow(CategoryItem row)
        {
            return GetRow(row.Id);
        }

        public async Task<ReturnValue<CategoryItem>> GetRowAsync(CategoryItem row)
        {
            return await GetRowAsync(row.Id);
        }

        //****************************************************************************************************
        // InsertRow
        //****************************************************************************************************
        public ReturnValue InsertRow(CategoryItem row)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            return InsertRowBase(_InsertRowSQL, FullCategoryItemParamsNoId(row));
        }

        public async Task<ReturnValue> InsertRowAsync(CategoryItem row)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.CreatedOn = DateTime.Now;
            row.ModifiedOn = DateTime.Now;

            return await InsertRowBaseAsync(_InsertRowSQL, FullCategoryItemParamsNoId(row));
        }

        //****************************************************************************************************
        // UpdateRow
        //****************************************************************************************************
        public ReturnValue UpdateRow(int id, CategoryItem row)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.ModifiedOn = DateTime.Now;

            return UpdateRowBase(_UpdateRowSQL, FullCategoryItemParams(row));
        }

        public ReturnValue UpdateRow(CategoryItem row)
        {
            return UpdateRow(row.Id, row);
        }

        public async Task<ReturnValue> UpdateRowAsync(int id, CategoryItem row)
        {
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            row.ModifiedOn = DateTime.Now;

            return await UpdateRowBaseAsync(_UpdateRowSQL, FullCategoryItemParams(row));
        }

        public async Task<ReturnValue> UpdateRowAsync(CategoryItem row)
        {
            return await UpdateRowAsync(row.Id, row);
        }

        //****************************************************************************************************
        // DeleteRow
        //****************************************************************************************************
        public ReturnValue DeleteRow(CategoryItem row)
        {
            return DeleteRow(row.Id);
        }

        public async Task<ReturnValue> DeleteRowAsync(CategoryItem row)
        {
            return await DeleteRowAsync(row.Id);
        }

        //****************************************************************************************************
        // Private string constant sql queries
        //****************************************************************************************************
        private const string _InsertRowSQL = @$"
            INSERT INTO {DbTableNames.CATEGORY_ITEM_TABLE}
            (
                {DbCategoryItemTable.CATEGORY_ID},
                {DbCategoryItemTable.ITEM_ID},
                {DbCategoryItemTable.CREATED_ON},
                {DbCategoryItemTable.MODIFIED_ON}
            )
            VALUES
            (
                @CategoryId,
                @ItemId,
                @CreatedOn,
                @ModifiedOn
            );
        ";

        private const string _UpdateRowSQL = @$"
            UPDATE {DbTableNames.CATEGORY_ITEM_TABLE}
            SET
                {DbCategoryItemTable.CATEGORY_ID} = @CategoryId,
                {DbCategoryItemTable.ITEM_ID} = @ItemId,
                {DbCategoryItemTable.MODIFIED_ON} = @ModifiedOn
            WHERE
                {DbCategoryItemTable.ID} = @Id
            ;
        ";

        //****************************************************************************************************
        // Private DynamicParamters Helper Methods
        //****************************************************************************************************
        private DynamicParameters FullCategoryItemParamsNoId(CategoryItem row)
        {
            var parameters = new DynamicParameters();
            parameters.Add("@CategoryId", row.CategoryId);
            parameters.Add("@ItemId", row.ItemId);
            parameters.Add("@CreatedOn", row.CreatedOn);
            parameters.Add("@ModifiedOn", row.ModifiedOn);

            return parameters;
        }

        private DynamicParameters FullCategoryItemParams(CategoryItem row)
        {
            var parameters = FullCategoryItemParamsNoId(row);
            parameters.Add("@Id", row.Id);

            return parameters;
        }
    }
}