using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Restaurant
{
    public class DeleteRestaurantRequest
    {
        [Required]
        public int Id { get; set; }
    }
}
