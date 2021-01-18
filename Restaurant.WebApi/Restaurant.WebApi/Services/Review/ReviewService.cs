using Microsoft.EntityFrameworkCore;
using Restaurant.WebApi.Models;
using Restaurant.WebApi.Services.DateTime;
using System.Linq;
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

            var hasUserAlreadyCreatedReview = db.Reviews.Any(r =>
                r.UserId == userId && r.RestaurantId == request.RestaurantId);
            if (hasUserAlreadyCreatedReview)
                return new CreateReviewResponse
                {
                    Errors = CreateError("CreateReview", "Multple reviews are not allowed.")
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

        public async Task<DeleteReviewResponse> DeleteReviewAsync(DeleteReviewRequest request)
        {
            var reviewDeletedResponse = new DeleteReviewResponse
            {
                Message = "Review deletion successful."
            };

            var review = await db.Reviews.FindAsync(request.Id);
            if (review is null)
                return reviewDeletedResponse;

            db.Reviews.Remove(review);
            var result = await db.SaveChangesAsync();
            if (result != 1)
                return new DeleteReviewResponse
                {
                    Errors = CreateError("DeleteReview", "Unable to delete review.")
                };

            return reviewDeletedResponse;
        }

        public async Task<GetAllReviewsResponse> GetAllReviewsAsync()
        {
            var reviews = db.Reviews.Select(r => new GetReviewResponse
            {
                Id = r.Id,
                RestaurantId = r.RestaurantId,
                UserId = r.UserId,
                Stars = r.Stars,
                Comment = r.Comment,
                VisitDate = r.VisitDate,
                Reply = r.Reply
            });
            return new GetAllReviewsResponse
            {
                Reviews = await Task.Run(() => reviews.ToList())
            };
        }

        public async Task<GetReviewResponse> GetReviewByIdAsync(GetReviewRequest request)
        {
            var review = await db.Reviews.FindAsync(request.Id);
            if (review is null)
                return new GetReviewResponse
                {
                    Errors = CreateError("GetReviewById", "Review not found.")
                };

            return new GetReviewResponse
            {
                Id = review.Id,
                RestaurantId = review.RestaurantId,
                UserId = review.UserId,
                Stars = review.Stars,
                Comment = review.Comment,
                VisitDate = review.VisitDate,
                Reply = review.Reply
            };
        }

        public async Task<bool> IsOwnerAuthorizedToReply(string ownerId, int reviewId)
        {
            var review = await db.Reviews
                .Where(r => r.Id == reviewId)
                .Include(r => r.Restaurant)
                .FirstOrDefaultAsync();
            if (review is null) return false;

            return review.Restaurant.OwnerId == ownerId;
        }

        public async Task<ReplyToReviewResponse> ReplyToReviewAsync(ReplyToReviewRequest request)
        {
            var review = await db.Reviews.FindAsync(request.Id);
            if (review is null)
                return new ReplyToReviewResponse
                {
                    Errors = CreateError("ReplyToReview", "Review not found.")
                };

            review.Reply = request.Reply;
            var resullt = await db.SaveChangesAsync();
            if (resullt != 1)
                return new ReplyToReviewResponse
                {
                    Errors = CreateError("ReplyToReview", "Unable to save the reply.")
                };

            return new ReplyToReviewResponse
            {
                Message = "Reply save successful."
            };
        }

        public async Task<UpdateReviewResponse> UpdateReviewAsync(UpdateReviewRequest request)
        {
            var review = await db.Reviews.FindAsync(request.Id);
            if (review is null)
                return new UpdateReviewResponse
                {
                    Errors = CreateError("UpdateReview", "Review not found.")
                };

            review.Stars = request.Stars;
            review.Comment = request.Comment;
            review.Reply = review.Reply is null ? null : request.Reply;
            var result = await db.SaveChangesAsync();
            if (result != 1)
                return new UpdateReviewResponse
                {
                    Errors = CreateError("UpdateReview", "Unable to update review.")
                };

            return new UpdateReviewResponse
            {
                Message = "Review update successful."
            };
        }
    }
}
