#nullable disable

using Restaurant.WebApi.Services.Common;
using Restaurant.WebApi.Services.Review;

namespace Restaurant.WebApi.Services.Restaurant
{
    public class GetDetailsResponse : ApiResponse
    {
        public double AverageRating { get; set; }
        public  GetReviewResponse HighestRatedReview { get; set; }
        public GetReviewResponse LowestRatedReview { get; set; }
        public GetReviewResponse LastReview { get; set; }
    }
}
