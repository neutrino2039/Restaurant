#nullable disable

using Restaurant.WebApi.Services.Common;
using System.Collections.Generic;

namespace Restaurant.WebApi.Services.User
{
    public class GetAllUsersResponse : ApiResponse
    {
        public List<GetUserResponse> Users { get; set; }
    }
}
