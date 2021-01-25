#nullable disable

using Restaurant.WebApi.Services.Common;

namespace Restaurant.WebApi.Services.User
{
    public class GetUserResponse : ApiResponse
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
    }
}
