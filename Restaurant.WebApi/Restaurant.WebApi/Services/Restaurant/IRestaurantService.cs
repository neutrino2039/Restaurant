using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Restaurant.WebApi.Services.Restaurant
{
    public interface IRestaurantService
    {
        Task<UploadImageResponse> UploadImageAsync(IFormFile image);
    }
}
