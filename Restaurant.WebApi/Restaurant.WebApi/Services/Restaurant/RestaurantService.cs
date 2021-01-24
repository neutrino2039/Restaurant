using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Restaurant.WebApi.Models;
using Restaurant.WebApi.Services.Review;
using System.IO;
using System.Linq;
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

            if (restaurant.Image != request.ImageName)
                File.Delete(Path.Combine(environment.WebRootPath, "Images", restaurant.Image));

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

        public async Task<DeleteRestaurantResponse> DeleteRestaurantAsync(DeleteRestaurantRequest request)
        {
            var userDeletedResponse = new DeleteRestaurantResponse
            {
                Message = "Restaurant delete succssful."
            };
            var restaurant = await Task.Run(() => 
                db.Restaurants
                    .Where(r => r.Id == request.Id)
                    .Include(r => r.Reviews)
                    .FirstOrDefault());
            if (restaurant is null)
                return userDeletedResponse;

            db.Restaurants.Remove(restaurant);
            var result = await db.SaveChangesAsync();
            if (result != 1)
                return new DeleteRestaurantResponse
                {
                    Errors = CreateError("DeleteRestaurant", "Unable to delete restaurant.")
                };

            File.Delete(Path.Combine(environment.WebRootPath, "Images", restaurant.Image));

            return new DeleteRestaurantResponse
            {
                Message = "Restaurant delete successful."
            };
        }

        public async Task<GetRestaurantResponse> GetRestaurantByIdAsync(GetRestaurantRequest request)
        {
            var restaurant = await db.Restaurants.FindAsync(request.Id);
            if (restaurant is null)
                return new GetRestaurantResponse
                {
                    Errors = CreateError("GetRestaurantById", "Restaurant not found")
                };
            return new GetRestaurantResponse
            {
                Id = restaurant.Id,
                Name = restaurant.Name,
                Address = restaurant.Address,
                ImageName = restaurant.Image
            };
        }

        public async Task<GetAllRestaurantsResponse> GetAllRestaurantsAsync(string userId,
            bool showOwnedOnly, GetAllRestaurantRequest request)
        {
            var restaurantsWithReviews = db.Restaurants
                .Include(r => r.Reviews)
                .Where(r => r.Reviews.Count > 0)
                .Select(r => new GetRestaurantResponse
                {
                    Id = r.Id,
                    Name = r.Name,
                    Address = r.Address,
                    ImageName = r.Image,
                    AverageStars = r.Reviews.Average(r => r.Stars),
                    OwnerId = r.OwnerId,
                    PendingReplies = r.Reviews.Count(r => r.Reply == null)
                });
            var restaurantsWithoutReviews = db.Restaurants
                .Include(r => r.Reviews)
                .Where(r => r.Reviews.Count == 0)
                .Select(r => new GetRestaurantResponse
                {
                    Id = r.Id,
                    Name = r.Name,
                    Address = r.Address,
                    ImageName = r.Image,
                    AverageStars = 0,
                    OwnerId = r.OwnerId,
                    PendingReplies = 0
                });
            var allRestaurants = restaurantsWithReviews.Union(restaurantsWithoutReviews);

            if (request.Sort)
            {
                if (request.SortDirection == SortDirection.Desc)
                    allRestaurants = allRestaurants.OrderByDescending(r => r.AverageStars);
                else
                    allRestaurants = allRestaurants.OrderBy(r => r.AverageStars);
            }

            if (request.Filter)
            {
                if (request.StarsFrom > request.StarsTo)
                {
                    var temp = request.StarsFrom;
                    request.StarsFrom = request.StarsTo;
                    request.StarsTo = temp;
                }
                allRestaurants = allRestaurants.Where(r =>
                    r.AverageStars >= request.StarsFrom
                    && r.AverageStars <= request.StarsTo);
            }

            if (showOwnedOnly)
                allRestaurants = allRestaurants.Where(r => r.OwnerId == userId);

            return new GetAllRestaurantsResponse
            {
                Restaurants = await Task.Run(() => allRestaurants.ToList())
            };
        }

        public async Task<GetDetailsResponse> GetDetailsAsync(GetDetailsRequest request)
        {
            var restaurantId = request.Id;

            if (await db.Restaurants.FindAsync(request.Id) is null)
                return new GetDetailsResponse
                {
                    Errors = CreateError("GetDetails", "Restaurant not found")
                };

            var details = new GetDetailsResponse();

            if (!await Task.Run(() => db.Reviews.Any(r => r.RestaurantId == restaurantId)))
                return details;

            details.AverageRating = await Task.Run(() =>
                db.Reviews.Where(r => r.RestaurantId == restaurantId).Average(r => r.Stars));

            var maxStars = await Task.Run(() => 
                db.Reviews.Where(r => r.RestaurantId == restaurantId).Max(r => r.Stars));
            details.HighestRatedReview = await Task.Run(() => db.Reviews
                .Where(r => r.RestaurantId == restaurantId && r.Stars == maxStars)
                .Select(r => new GetReviewResponse
                {
                    Id = r.Id,
                    RestaurantId = r.RestaurantId,
                    UserId = r.UserId,
                    Stars = r.Stars,
                    Comment = r.Comment,
                    VisitDate = r.VisitDate,
                    Reply = r.Reply
                }).FirstOrDefault());

            var minStars = await Task.Run(() => 
                db.Reviews.Where(r => r.RestaurantId == restaurantId).Min(r => r.Stars));
            details.LowestRatedReview = await Task.Run(() => db.Reviews
                .Where(r => r.RestaurantId == restaurantId && r.Stars == minStars)
                .Select(r => new GetReviewResponse
                {
                    Id = r.Id,
                    RestaurantId = r.RestaurantId,
                    UserId = r.UserId,
                    Stars = r.Stars,
                    Comment = r.Comment,
                    VisitDate = r.VisitDate,
                    Reply = r.Reply
                }).FirstOrDefault());

            var last = await Task.Run(() => 
                db.Reviews.Where(r => r.RestaurantId == restaurantId).Max(r => r.Id));
            details.LastReview = await Task.Run(() => db.Reviews
                .Where(r => r.RestaurantId == restaurantId && r.Id == last)
                .Select(r => new GetReviewResponse
                {
                    Id = r.Id,
                    RestaurantId = r.RestaurantId,
                    UserId = r.UserId,
                    Stars = r.Stars,
                    Comment = r.Comment,
                    VisitDate = r.VisitDate,
                    Reply = r.Reply
                }).FirstOrDefault());

            return details;
        }
    }
}
