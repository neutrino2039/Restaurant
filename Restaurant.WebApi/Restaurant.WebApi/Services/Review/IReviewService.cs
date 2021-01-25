using System.Threading.Tasks;

namespace Restaurant.WebApi.Services.Review
{
    public interface IReviewService
    {
        Task<CreateReviewResponse> CreateReviewAsync(string userId, CreateReviewRequest request);
        Task<UpdateReviewResponse> UpdateReviewAsync(UpdateReviewRequest request);
        Task<DeleteReviewResponse> DeleteReviewAsync(DeleteReviewRequest request);
        Task<GetReviewResponse> GetReviewByIdAsync(GetReviewByIdRequest request);
        Task<GetReviewResponse> GetReviewByRestaurantIdAsync(string userId, GetReviewByRestaurantIdRequest request);
        Task<GetAllReviewsResponse> GetAllReviewsByRestaurantId(GetAllReviewsByRestaurantIdRequest request);
        Task<ReplyToReviewResponse> ReplyToReviewAsync(ReplyToReviewRequest request);
        Task<bool> IsOwnerAuthorizedToReply(string ownerId, int reviewId);
        Task<GetReviewsPendingReplyResponse> GetReviewsPendingReplyAsync(GetReviewsPendingReplyRequest request);
    }
}
