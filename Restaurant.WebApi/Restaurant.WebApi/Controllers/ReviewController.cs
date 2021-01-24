using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Services.Review;
using System.Threading.Tasks;
using static Restaurant.WebApi.Helpers.ErrorHelper;

namespace Restaurant.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ApiControllerBase
    {
        private IReviewService reviewService;

        public ReviewController(IReviewService reviewService)
        {
            this.reviewService = reviewService;
        }

        [Authorize(Roles = Roles.REGULAR)]
        [HttpPost("Create")]
        public async Task<IActionResult> CreateReviewAsync(CreateReviewRequest request)
        {
            return ApiResult(await reviewService.CreateReviewAsync(User.Identity!.Name!, request));
        }

        [Authorize(Roles = Roles.ADMIN)]
        [HttpPost("Update")]
        public async Task<IActionResult> UpdateReviewAsync(UpdateReviewRequest request)
        {
            return ApiResult(await reviewService.UpdateReviewAsync(request));
        }

        [Authorize(Roles = Roles.ADMIN)]
        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteReviewAsync(DeleteReviewRequest request)
        {
            return ApiResult(await reviewService.DeleteReviewAsync(request));
        }

        [Authorize(Roles = Roles.ALL)]
        [HttpGet("GetById")]
        public async Task<IActionResult> GetReviewByIdAsync([FromQuery]GetReviewByIdRequest request)
        {
            return ApiResult(await reviewService.GetReviewByIdAsync(request));
        }

        [Authorize(Roles = Roles.ALL)]
        [HttpGet("GetByRestaurantId")]
        public async Task<IActionResult> GetReviewByRestaurantIdAsync([FromQuery]GetReviewByRestaurantIdRequest request)
        {
            return ApiResult(await reviewService.GetReviewByRestaurantIdAsync(User.Identity!.Name!, request));
        }

        [Authorize(Roles = Roles.ALL)]
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllReviewsAsync()
        {
            return ApiResult(await reviewService.GetAllReviewsAsync());
        }

        [Authorize(Roles = Roles.OWNER)]
        [HttpPost("ReplyToReview")]
        public async Task<IActionResult> ReplyToReview(ReplyToReviewRequest request)
        {
            if (!await reviewService.IsOwnerAuthorizedToReply(User.Identity!.Name!, request.Id))
                return AuthorizationResult(new ReplyToReviewResponse
                {
                    Errors = CreateError("ReplyToReview", "Unauthorized access.")
                });
            return ApiResult(await reviewService.ReplyToReviewAsync(request));
        }

        [Authorize(Roles = Roles.OWNER)]
        [HttpGet("GetReviewsPendingReply")]
        public async Task<IActionResult> GetReviewsPendingReplyAsync([FromQuery]GetReviewsPendingReplyRequest request)
        {
            return ApiResult(await reviewService.GetReviewsPendingReplyAsync(request));
        }
    }
}
