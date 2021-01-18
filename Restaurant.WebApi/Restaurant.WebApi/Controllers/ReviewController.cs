using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Services.Review;
using System;
using System.Collections.Generic;
using System.Linq;
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
    }
}
