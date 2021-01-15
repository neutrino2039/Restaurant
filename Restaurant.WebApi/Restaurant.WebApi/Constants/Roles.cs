namespace Restaurant.WebApi.Constants
{
    public class Roles
    {
        public const string ADMIN = "Admin";
        public const string OWNER = "Owner";
        public const string REGULAR = "Regular";
        public const string ALL = ADMIN + "," + OWNER + "," + REGULAR;
        public const string ADMIN_OR_OWNER = ADMIN + "," + OWNER;
    }
}
