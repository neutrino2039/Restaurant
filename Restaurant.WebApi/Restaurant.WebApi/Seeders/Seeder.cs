using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Services.User;
using System;
using System.Threading.Tasks;

namespace Restaurant.WebApi.Seeders
{
    public static class Seeder
    {
        public static async Task SeedDataAsync(IServiceProvider serviceProvider)
        {
            var configuration = serviceProvider.GetRequiredService<IConfiguration>();
            var userService = serviceProvider.GetRequiredService<IUserService>();

            await SeedRoles(userService);
            await SeedDefaultAdminUser(configuration, userService);
        }

        private static async Task SeedRoles(IUserService userService)
        {
            await userService.CreateRole(Roles.ADMIN);
            await userService.CreateRole(Roles.OWNER);
            await userService.CreateRole(Roles.REGULAR);
        }

        private static async Task SeedDefaultAdminUser(IConfiguration configuration, IUserService userService)
        {
            var userName = configuration["DefaultAdminCredentials:UserName"];
            var password = configuration["DefaultAdminCredentials:Password"];
            var firstName = configuration["DefaultAdminCredentials:FirstName"];
            var lastName = configuration["DefaultAdminCredentials:LastName"];
            await userService.CreateUserWithRole(userName, password, firstName, lastName, Roles.ADMIN);
        }
    }
}
