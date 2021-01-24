#nullable disable

using Restaurant.WebApi.Services.Common;

namespace Restaurant.WebApi.Services.User
{
    public class LoginResponse : ApiResponse
    {
        public string Id { get; set; }
        public string Token { get; set; }
        public string Role { get; set; }
    }
}
