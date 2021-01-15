#nullable disable

using Restaurant;

namespace Restaurant.WebApi.Services.Common
{
    public class ApiResponse
    {
        public bool IsSuccess { get; set; }

        public string Message { get; set; }
    }
}
