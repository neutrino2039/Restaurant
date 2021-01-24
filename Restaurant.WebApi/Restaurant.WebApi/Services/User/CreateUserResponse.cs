#nullable disable

using Restaurant.WebApi.Services.Common;

namespace Restaurant.WebApi.Services.User
{
    public class CreateUserResponse : ApiResponse
    {
        public string Id { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
    }
}
