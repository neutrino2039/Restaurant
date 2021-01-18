#nullable disable

using Restaurant.WebApi.Services.Common;

namespace Restaurant.WebApi.Services.Review
{
    public class GetReviewResponse : ApiResponse
    {
        public int Id { get; set; }
        public int RestaurantId { get; set; }
        public string UserId { get; set; }
        public int Stars { get; set; }
        public string Comment { get; set; }
        public System.DateTime VisitDate { get; set; }
        public string Reply { get; set; }
    }
}
