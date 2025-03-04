using System.Data;
using Domain.Identity;
using Persistance.Migrations.DbConstants;

namespace Persistance.Identity
{
    public class UserEntity : DbBaseLayer<UserData>, IDbBaseInterface<UserData>
    {
        public UserEntity(ILogger<DbBaseLayer<UserData>> logger, IConfiguration configuration) : base(logger, configuration)
        {
            TableName = DbTableNames.USER_DATA_TABLE;
        }

        public DbMessage InsertRow(UserData row)
        {
            string sql = $"INSERT INTO {TableName} (UserName, Email, Password) VALUES (@UserName, @Email, @Password)";
            return InsertRowBase(row, sql);
        }

        public async Task<DbMessage> InsertRowAsync(UserData row)
        {
            string sql = $"INSERT INTO {TableName} (UserName, Email, Password) VALUES (@UserName, @Email, @Password)";
            return await InsertRowBaseAsync(row, sql);
        }

        public DbMessage UpdateRow(int id, UserData row)
        {
            string sql = $"UPDATE {TableName} SET UserName = @UserName, Email = @Email, Password = @Password";
            return UpdateRowBase(id, row, sql);
        }

        public async Task<DbMessage> UpdateRowAsync(int id, UserData row)
        {
            string sql = $"UPDATE {TableName} SET UserName = @UserName, Email = @Email, Password = @Password";
            return await UpdateRowBaseAsync(id, row, sql);
        }
    }
}