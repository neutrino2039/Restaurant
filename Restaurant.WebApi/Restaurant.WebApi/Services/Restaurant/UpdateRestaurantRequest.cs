#nullable disable

using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Restaurant
{
    public class UpdateRestaurantRequest
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [StringLength(100)]
        public string Address { get; set; }

        [Required]
        [StringLength(16)]
        public string ImageName { get; set; }
    }
}
