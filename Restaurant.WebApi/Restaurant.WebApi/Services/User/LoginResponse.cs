using Restaurant.WebApi.Services.Common;

namespace Restaurant.WebApi.Services.User
{
    public class LoginResponse : ApiResponse
    {
        public string Token { get; set; }
    }
}
