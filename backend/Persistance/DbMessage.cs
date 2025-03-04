namespace Persistance
{
    public class DbMessage<T>
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; } = default(T);
    }

    public class DbMessage
    {
        public bool Success { get; set; } = false;
        public string Message { get; set; } = string.Empty;
    }
}