using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Restaurant.WebApi.Models;
using System.IO;
using System.Threading.Tasks;
using static Restaurant.WebApi.Helpers.ErrorHelper;

namespace Restaurant.WebApi.Services.Restaurant
{
    public class RestaurantService : IRestaurantService
    {
        private IWebHostEnvironment environment;
        private AppDbContext db;

        public RestaurantService(IWebHostEnvironment environment, AppDbContext db)
        {
            this.environment = environment;
            this.db = db;
        }

        public async Task<UploadImageResponse> UploadImageAsync(IFormFile image)
        {
            var destinationImageName = Path.GetRandomFileName() + Path.GetExtension(image.FileName);
            var destinationImage = Path.Combine(
                environment.WebRootPath, "Images", destinationImageName);
            using var stream = File.Create(destinationImage);
            await image.CopyToAsync(stream);
            return new UploadImageResponse { FileName = destinationImageName };
        }

        public async Task<CreateRestaurantResponse> CreateRestaurantAsync(
            string userId, CreateRestaurantRequest request)
        {
            var restaurant = new Models.Restaurant
            {
                Name = request.Name,
                Address = request.Address,
                Image = request.ImageName,
                OwnerId = userId
            };
            db.Restaurants.Add(restaurant);
            var result = await db.SaveChangesAsync();

            if (result != 1)
                return new CreateRestaurantResponse
                {
                    Errors = CreateError("CreateRestaurant", "Unable to create restaurant.")
                };

            return new CreateRestaurantResponse
            {
                Message = "Restaurant creation successful."
            };
        }

        public async Task<UpdateRestaurantResponse> UpdateRestaurantAsync(UpdateRestaurantRequest request)
        {
            var restaurant = await db.Restaurants.FindAsync(request.Id);
            if (restaurant is null)
                return new UpdateRestaurantResponse
                {
                    Errors = CreateError("UpdateRestaurant", "Restaurant not found.")
                };

            restaurant.Name = request.Name;
            restaurant.Address = request.Address;
            restaurant.Image = request.ImageName;
            var result = await db.SaveChangesAsync();
            if (result != 1)
                return new UpdateRestaurantResponse
                {
                    Errors = CreateError("UpdateRestaurant", "Unable to update restaurant.")
                };

            return new UpdateRestaurantResponse
            {
                Message = "Restaurant update successful."
            };
        }
    }
}
