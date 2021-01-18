using System.Threading.Tasks;

namespace Restaurant.WebApi.Services.Review
{
    public interface IReviewService
    {
        Task<CreateReviewResponse> CreateReviewAsync(string userId, CreateReviewRequest request);
        Task<UpdateReviewResponse> UpdateReviewAsync(UpdateReviewRequest request);
        Task<DeleteReviewResponse> DeleteReviewAsync(DeleteReviewRequest request);
        Task<GetReviewResponse> GetReviewByIdAsync(GetReviewRequest request);
    }
}
