using backend.Persistence.Models.Identity;
using backend.Persistence.ModelValidations;
using Dapper;
using Library.ErrorHandling;
using Persistence;
namespace backend.Services.Identity
{
    public class UserDataServices : DbBaseLayer<UserDataServices, UserData>, IDbBaseInterface<UserData>
    {
        public UserDataServices(
            ILogger<UserDataServices> logger,
            IConfiguration configuration,
            IModelValidation<UserData> modelValidation)
            : base(logger, configuration, modelValidation)
        {
        }

        public ReturnValue InsertRow(UserData row)
        {
            //Do validation
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            //If validation passes, do insert row
            //create the query
            var sql = "INSERT INTO UserData (Username, Email, Password) VALUES (@Username, @Email, @Password);";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("@Username", row.Username);
            parameters.Add("@Email", row.Email);
            parameters.Add("@Password", row.Password);
            //execute the query
            //do I want to catch errors here or pass them along? for now we're passing
            return InsertRowBase(sql, parameters);
        }

        public async Task<ReturnValue> InsertRowAsync(UserData row)
        {
            return await Task.Run(() => InsertRow(row));
        }

        public ReturnValue UpdateRow(int id, UserData row)
        {
            //Do validation
            var returnValue = _modelValidation.ValidateModel(row);
            if (!returnValue.Success)
            {
                return returnValue;
            }
            //If validation passes, do update row
            //create the query  
            var sql = "UPDATE UserData SET Username = @Username, Email = @Email, Password = @Password WHERE Id = @Id;";
            //create the parameters
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);
            parameters.Add("@Username", row.Username);
            parameters.Add("@Email", row.Email);
            parameters.Add("@Password", row.Password);
            //execute the query
            //do I want to catch errors here or pass them along? for now we're passing
            return UpdateRowBase(sql, parameters);
        }

        public async Task<ReturnValue> UpdateRowAsync(int id, UserData row)
        {
            return await Task.Run(() => UpdateRow(id, row));
        }
    }
}