#nullable disable

using System.Collections.Generic;

namespace Restaurant.WebApi.Services.Common
{
    public class ApiResponse
    {
        public string Message { get; set; }
        public Dictionary<string, List<string>> Errors { get; set; }
    }
}
