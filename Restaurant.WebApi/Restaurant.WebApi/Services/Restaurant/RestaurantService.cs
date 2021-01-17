using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Restaurant.WebApi.Models;
using System.IO;
using System.Threading.Tasks;

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
    }
}
