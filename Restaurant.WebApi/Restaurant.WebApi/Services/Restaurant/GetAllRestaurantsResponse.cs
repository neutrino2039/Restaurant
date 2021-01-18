#nullable disable

using Restaurant.WebApi.Services.Common;
using System.Collections.Generic;

namespace Restaurant.WebApi.Services.Restaurant
{
    public class GetAllRestaurantsResponse : ApiResponse
    {
        public List<GetRestaurantResponse> Restaurants { get; set; }
    }
}
