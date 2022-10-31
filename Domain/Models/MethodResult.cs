namespace Domain.Models
{
    public class MethodResult<T>
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; }
        public T Content { get; set; }
    }
}
