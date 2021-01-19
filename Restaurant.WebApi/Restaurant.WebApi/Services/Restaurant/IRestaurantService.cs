using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Restaurant.WebApi.Services.Restaurant
{
    public interface IRestaurantService
    {
        Task<UploadImageResponse> UploadImageAsync(IFormFile image);
        Task<CreateRestaurantResponse> CreateRestaurantAsync(string userId, CreateRestaurantRequest request);
        Task<UpdateRestaurantResponse> UpdateRestaurantAsync(UpdateRestaurantRequest request);
        Task<DeleteRestaurantResponse> DeleteRestaurantAsync(DeleteRestaurantRequest request);
        Task<GetRestaurantResponse> GetRestaurantByIdAsync(GetRestaurantRequest request);
        Task<GetAllRestaurantsResponse> GetAllRestaurantsAsync(GetAllRestaurantRequest request);
    }
}
