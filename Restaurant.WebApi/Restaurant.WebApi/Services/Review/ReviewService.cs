using Restaurant.WebApi.Models;
using Restaurant.WebApi.Services.DateTime;
using System.Threading.Tasks;
using static Restaurant.WebApi.Helpers.ErrorHelper;

namespace Restaurant.WebApi.Services.Review
{
    public class ReviewService : IReviewService
    {
        private AppDbContext db;
        private IDateTimeService dateTimeService;

        public ReviewService(AppDbContext db, IDateTimeService dateTimeService)
        {
            this.db = db;
            this.dateTimeService = dateTimeService;
        }

        public async Task<CreateReviewResponse> CreateReviewAsync(string userId, CreateReviewRequest request)
        {
            var restaurant = await db.Restaurants.FindAsync(request.RestaurantId);
            if (restaurant is null)
                return new CreateReviewResponse
                {
                    Errors = CreateError("CreateReview", "Restaurant not found.")
                };

            var review = new Models.Review
            {
                RestaurantId = request.RestaurantId,
                UserId = userId,
                Stars = request.Stars,
                Comment = request.Comment,
                VisitDate = dateTimeService.Now
            };
            db.Reviews.Add(review);
            var result = await db.SaveChangesAsync();
            if (result != 1)
                return new CreateReviewResponse
                {
                    Errors = CreateError("CreateReview", "Unable to create review.")
                };

            return new CreateReviewResponse
            {
                Message = "Review creation successful."
            };
        }
    }
}
