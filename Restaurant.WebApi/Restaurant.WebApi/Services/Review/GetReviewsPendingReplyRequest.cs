using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Review
{
    public class GetReviewsPendingReplyRequest
    {
        [Required]
        public int RestaurantId { get; set; }
    }
}
