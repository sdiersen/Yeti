namespace Persistance
{
    public interface IDbBaseInterface<T>
    {
        DbMessage UpdateRow(int id, T row);
        Task<DbMessage> UpdateRowAsync(int id, T row);
        DbMessage InsertRow(T row);
        Task<DbMessage> InsertRowAsync(T row);

        // The following are usually provided by an abstract class
        // currently that is DbBaseLayer<T>
        DbMessage DeleteRow(int id);
        Task<DbMessage> DeleteRowAsync(int id);
        DbMessage<T> GetRow(int id);
        Task<DbMessage<T>> GetRowAsync(int id);
        DbMessage<List<T>> GetFirstXRows(int x);
        Task<DbMessage<List<T>>> GetFirstXRowsAsync(int x);
    }
}