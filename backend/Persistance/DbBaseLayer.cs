using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration.Json;

namespace Persistance
{
    public abstract class DbBaseLayer<T>
    {
        protected readonly string _connectionString;
        protected readonly IConfiguration _configuration;
        protected readonly ILogger<DbBaseLayer<T>> _logger;
        protected int Id { get; set; }
        protected string TableName { get; set; } = string.Empty;
        protected DateTime CreatedOn { get; set; }
        protected DateTime ModifiedOn { get; set; }

        public DbBaseLayer(ILogger<DbBaseLayer<T>> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;

            // try to get YETI_DB_CONNECTION_STRING from environment variables
            string? connectionString = Environment.GetEnvironmentVariable("YETI_DB_CONNECTION_STRING");
            if (string.IsNullOrEmpty(connectionString))
            {
                // try to get YETI_DB_CONNECTION_STRING from appsettings.json
                connectionString = _configuration.GetConnectionString("YETI_DB_CONNECTION_STRING");
                if (string.IsNullOrEmpty(connectionString))
                {
                    throw new ArgumentNullException("YETI_DB_CONNECTION_STRING is not set");
                }
            }
            _connectionString = connectionString;
        }

        public DbMessage DeleteRow(int id)
        {
            DbMessage dbMessage = new DbMessage();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    connection.Open();
                    string query = $"DELETE FROM {TableName} WHERE Id = @Id";
                    int rowsAffected = connection.Execute(query, new { Id = id });
                    dbMessage.Success = true;
                    dbMessage.Message = rowsAffected == 0 ? "Delete query returned successfully, but 0 rows were affected." :
                                                                $"Delete query returned successfully. Number of rows affected: {rowsAffected}";
                }
                catch (Exception ex)
                {
                    dbMessage.Success = false;
                    dbMessage.Message = ex.Message;
                }
            }
            return dbMessage;
        }

        public async Task<DbMessage> DeleteRowAsync(int id)
        {
            DbMessage dbMessage = new DbMessage();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    await connection.OpenAsync();
                    string query = $"DELETE FROM {TableName} WHERE Id = @Id";
                    int rowsAffected = await connection.ExecuteAsync(query, new { Id = id });
                    dbMessage.Success = true;
                    dbMessage.Message = rowsAffected == 0 ? "Delete query returned successfully, but 0 rows were affected." :
                                                                $"Delete query returned successfully. Number of rows affected: {rowsAffected}";
                }
                catch (Exception ex)
                {
                    dbMessage.Success = false;
                    dbMessage.Message = ex.Message;
                }
            }
            return dbMessage;
        }

        public DbMessage<T> GetRow(int id)
        {
            DbMessage<T> dbMessage = new DbMessage<T>();
            using (var connection = new SqlConnection(_connectionString))
            {
                string query = $"SELECT * FROM {TableName} WHERE Id = @Id";

                try
                {
                    connection.Open();
                    var row = connection.QueryFirstOrDefault<T>(query, new { Id = id });
                    if (row != null)
                    {
                        dbMessage.Success = true;
                        dbMessage.Message = $"{TableName} row with Id: {id} found.";
                        dbMessage.Data = row;
                    }
                    else
                    {
                        dbMessage.Message = $"No {TableName} row found with Id: {id}.";
                    }
                }
                catch (Exception ex)
                {
                    dbMessage.Message = ex.Message;
                }
            }
            return dbMessage;
        }

        public async Task<DbMessage<T>> GetRowAsync(int id)
        {
            DbMessage<T> dbMessage = new DbMessage<T>();
            using (var connection = new SqlConnection(_connectionString))
            {
                string query = $"SELECT * FROM {TableName} WHERE Id = @Id";

                try
                {
                    await connection.OpenAsync();
                    var row = await connection.QueryFirstOrDefaultAsync<T>(query, new { Id = id });
                    if (row != null)
                    {
                        dbMessage.Success = true;
                        dbMessage.Message = $"{TableName} row with Id: {id} found.";
                        dbMessage.Data = row;
                    }
                    else
                    {
                        dbMessage.Message = $"No {TableName} row found with Id: {id}.";
                    }
                }
                catch (Exception ex)
                {
                    dbMessage.Message = ex.Message;
                }
            }
            return dbMessage;
        }

        public DbMessage<List<T>> GetFirstXRows(int numberOfRows)
        {
            DbMessage<List<T>> dbMessage = new DbMessage<List<T>>();
            using (var connection = new SqlConnection(_connectionString))
            {
                string query = $"SELECT TOP @rows * FROM {TableName}";
                try
                {
                    var rows = connection.Query<T>(query, new { rows = numberOfRows });
                    dbMessage.Success = true;
                    dbMessage.Data = rows.ToList();
                    dbMessage.Message = rows.Any() ? $"Get {numberOfRows} rows from {TableName} returned successfully, {rows.Count()} were returned." :
                                                        $"Get {numberOfRows} rows from {TableName} returned successfully, but 0 rows were returned.";
                }
                catch (Exception ex)
                {
                    dbMessage.Message = ex.Message;
                }
                return dbMessage;
            }
        }

        public async Task<DbMessage<List<T>>> GetFirstXRowsAsync(int numberOfRows)
        {
            DbMessage<List<T>> dbMessage = new DbMessage<List<T>>();
            using (var connection = new SqlConnection(_connectionString))
            {
                string query = $"SELECT TOP @rows * FROM {TableName}";
                try
                {
                    var rows = await connection.QueryAsync<T>(query, new { rows = numberOfRows });
                    dbMessage.Success = true;
                    dbMessage.Data = rows.ToList();
                    dbMessage.Message = rows.Any() ? $"Get {numberOfRows} rows from {TableName} returned successfully, {rows.Count()} were returned." :
                                                        $"Get {numberOfRows} rows from {TableName} returned successfully, but 0 rows were returned.";
                }
                catch (Exception ex)
                {
                    dbMessage.Message = ex.Message;
                }
                return dbMessage;
            }
        }

        /*
        Protected Methods:
        Inserting and Updating require information specific to the derived class, so these methods are protected.
        the parameter string sql for each method is how the derived classes will pass specific data for the queries.
        These methods are here to handle the dapper calls to the database and to create the DbMessage object that is returned.
        */

        protected DbMessage InsertRowBase(T row, string sql)
        {
            DbMessage dbMessage = new DbMessage();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    int rowsAffected = connection.Execute(sql, row);
                    dbMessage.Success = true;
                    dbMessage.Message = rowsAffected == 0 ? $"Insert row into {TableName} async returned successfully, but 0 rows were affected." :
                                                    $"Insert row into {TableName} async returned successfully. Number of rows affected: {rowsAffected}";
                }
                catch (Exception ex)
                {
                    dbMessage.Success = false;
                    dbMessage.Message = ex.Message;
                }
            }
            return dbMessage;
        }

        protected async Task<DbMessage> InsertRowBaseAsync(T row, string sql)
        {
            DbMessage dbMessage = new DbMessage();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    int rowsAffected = await connection.ExecuteAsync(sql, row);
                    dbMessage.Success = true;
                    dbMessage.Message = rowsAffected == 0 ? $"Insert row into {TableName} async returned successfully, but 0 rows were affected." :
                                                    $"Insert row into {TableName} async returned successfully. Number of rows affected: {rowsAffected}";
                }
                catch (Exception ex)
                {
                    dbMessage.Success = false;
                    dbMessage.Message = ex.Message;
                }
            }
            return dbMessage;
        }

        public DbMessage UpdateRowBase(int id, T row, string sql)
        {
            DbMessage dbMessage = new DbMessage();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    int rowsAffected = connection.Execute(sql, row);
                    dbMessage.Success = true;
                    dbMessage.Message = rowsAffected == 0 ? $"Update {TableName} row {id} returned successfully, but 0 rows were affected." :
                                                            $"Update {TableName} row {id} returned successfully. Number of rows affected: {rowsAffected}";
                }
                catch (Exception ex)
                {
                    dbMessage.Success = false;
                    dbMessage.Message = ex.Message;
                }
            }
            return dbMessage;
        }

        public async Task<DbMessage> UpdateRowBaseAsync(int id, T row, string sql)
        {
            DbMessage dbMessage = new DbMessage();
            using (var connection = new SqlConnection(_connectionString))
            {
                try
                {
                    int rowsAffected = await connection.ExecuteAsync(sql, row);
                    dbMessage.Success = true;
                    dbMessage.Message = rowsAffected == 0 ? $"Update {TableName} row {id} returned successfully, but 0 rows were affected." :
                                                            $"Update {TableName} row {id} returned successfully. Number of rows affected: {rowsAffected}";
                }
                catch (Exception ex)
                {
                    dbMessage.Success = false;
                    dbMessage.Message = ex.Message;
                }
            }
            return dbMessage;
        }
    }
}