#nullable disable

using Restaurant.WebApi.Services.Common;

namespace Restaurant.WebApi.Services.Restaurant
{
    public class GetRestaurantResponse : ApiResponse
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }

        public string ImageName { get; set; }
        public double AverageStars { get; set; }
        public string OwnerId { get; set; }
    }
}
