#nullable disable

using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Review
{
    public class GetReviewByRestaurantIdRequest
    {
        [Required]
        public int RestaurantId { get; set; }
    }
}
