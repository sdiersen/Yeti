using commonColumns = Persistence.Migrations.Constants.DbCommonColumns;

namespace Persistence.Migrations.Constants
{
    public static class DbUserDataTable
    {
        public const string ID = commonColumns.ID;
        public const string CREATED_ON = commonColumns.CREATED_ON;
        public const string MODIFIED_ON = commonColumns.MODIFIED_ON;
        public const string USERNAME = "UserName";
        public const string EMAIL = "Email";
        public const string PASSWORD = "Password";
    }
}