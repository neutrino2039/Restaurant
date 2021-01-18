using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Services.Review;
using System.Threading.Tasks;

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
    }
}
