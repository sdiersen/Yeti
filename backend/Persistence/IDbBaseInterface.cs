using Library.ErrorHandling;

namespace Persistence
{
    public interface IDbBaseInterface<T>
    {
        ReturnValue UpdateRow(int id, T row);
        Task<ReturnValue> UpdateRowAsync(int id, T row);
        ReturnValue InsertRow(T row);
        Task<ReturnValue> InsertRowAsync(T row);

        // The following are usually provided by an abstract class
        // currently that is DbBaseLayer<T>
        ReturnValue DeleteRow(int id);
        Task<ReturnValue> DeleteRowAsync(int id);
        ReturnValue<T> GetRow(int id);
        Task<ReturnValue<T>> GetRowAsync(int id);
        ReturnValue<List<T>> GetFirstXRows(int x);
        Task<ReturnValue<List<T>>> GetFirstXRowsAsync(int x);
    }
}