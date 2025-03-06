namespace Library.ErrorHandling
{
    /// <summary>
    /// used to return the status of a function call. 
    /// Success is true if there were no errors.
    /// Value is the data returned from the function. If the data does not exist or matter, then use the non-generic version of ReturnValue.
    /// Errors is a list of errors that occurred during the function call. If Success is true, then this list will be empty.
    /// Messages can be thought of as a list of developer notes that are being passed along with the ReturnValue. Typically, this should be empty in production,
    /// but could be used to pass text back to the user.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ReturnValue<T>
    {
        public bool Success { get; set; } = false;
        //Errors are Exception messages, developer messages to help diagnose a problem, etc.
        public List<string> Errors { get; set; } = [];
        //Messages can be used for validation, developer notes, anything the user should see.
        public List<string> Messages { get; set; } = [];
        public T? Data { get; set; } = default(T);
    }

    public class ReturnValue
    {
        public bool Success { get; set; } = false;
        public List<string> Errors { get; set; } = [];
        public List<string> Messages { get; set; } = [];
    }
}