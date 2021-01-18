using System.Threading.Tasks;

namespace Restaurant.WebApi.Services.Review
{
    public interface IReviewService
    {
        Task<CreateReviewResponse> CreateReviewAsync(string userId, CreateReviewRequest request);
    }
}
