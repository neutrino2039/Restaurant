using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Review
{
    public class GetAllReviewsByRestaurantIdRequest
    {
        [Required]
        public int RestaurantId { get; set; }
    }
}
