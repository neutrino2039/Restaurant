using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Restaurant
{
    public class GetRestaurantRequest
    {
        [Required]
        public int Id { get; set; }
    }
}
