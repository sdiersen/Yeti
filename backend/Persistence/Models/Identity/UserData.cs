namespace backend.Persistence.Models.Identity
{
    public class UserData : AbstractBaseModel
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        static public UserData DefaultUser()
        {
            return new UserData { Id = -1 };
        }
    }
}