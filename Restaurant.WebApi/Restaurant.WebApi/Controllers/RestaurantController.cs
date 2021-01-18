using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Services.Restaurant;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static Restaurant.WebApi.Helpers.ErrorHelper;

namespace Restaurant.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantController : ApiControllerBase
    {
        private IRestaurantService restaurantService;
        private IConfiguration configuration;

        public RestaurantController(IRestaurantService restaurantService, IConfiguration configuration)
        {
            this.restaurantService = restaurantService;
            this.configuration = configuration;
        }

        [Authorize(Roles = Roles.ADMIN_OR_OWNER)]
        [HttpPost("UploadImage")]
        public async Task<IActionResult> UploadImageAsync([Required] IFormFile image)
        {
            var validationResult = ValidateImage(image);
            if (validationResult is not null) return validationResult;

            return ApiResult(await restaurantService.UploadImageAsync(image));
        }

        private IActionResult? ValidateImage(IFormFile image)
        {
            var fileSizeLimit = configuration.GetValue<long>("FileSizeLimit");
            if (image.Length == 0 || image.Length > fileSizeLimit)
                return ApiResult(new UploadImageResponse
                {
                    Errors = CreateError("UploadImage", "File size limit is 2MB.")
                }); ;

            var allowedExtensions = new[] { ".png", ".jpg" };
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
                return ApiResult(new UploadImageResponse
                {
                    Errors = CreateError("UploadImage", "Only PNG and JPG images are allowed")
                });

            return null;
        }

        [Authorize(Roles = Roles.OWNER)]
        [HttpPost("Create")]
        public async Task<IActionResult> CreateRestaurantAsync(CreateRestaurantRequest request)
        {
            return ApiResult(await restaurantService.CreateRestaurantAsync(User.Identity!.Name!, request));
        }

        [Authorize(Roles = Roles.ADMIN)]
        [HttpPost("Update")]
        public async Task<IActionResult> UpdateRestaurantAsync(UpdateRestaurantRequest request)
        {
            return ApiResult(await restaurantService.UpdateRestaurantAsync(request));
        }

        [Authorize(Roles = Roles.ADMIN)]
        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteRestaurantAsync(DeleteRestaurantRequest request)
        {
            return ApiResult(await restaurantService.DeleteRestaurantAsync(request));
        }
    }
}
