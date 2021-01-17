#nullable disable

using Restaurant.WebApi.Services.Common;

namespace Restaurant.WebApi.Services.Restaurant
{
    public class UploadImageResponse : ApiResponse
    {
        public string FileName { get; set; }
    }
}
