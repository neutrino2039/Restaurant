using Microsoft.AspNetCore.Identity;
using System;
using System.Threading.Tasks;

namespace Restaurant.WebApi.Services.User
{
    public interface IUserService
    {
        Task<IdentityResult> CreateRole(string role);
        Task<IdentityUser> CreateUser(string userName, string password);
        Task<IdentityResult> AssignRoleToUser(string role, IdentityUser user);
    }

    public class UserService : IUserService
    {
        private RoleManager<IdentityRole> roleManager;
        private UserManager<IdentityUser> userManager;

        public UserService(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
        }

        public async Task<IdentityResult> CreateRole(string role)
        {
            var result = await roleManager.CreateAsync(new IdentityRole(role));
            if (!result.Succeeded)
                throw new Exception("Unable to create role.");
            return result;
        }

        public async Task<IdentityUser> CreateUser(string userName, string password)
        {
            var user = new IdentityUser
            {
                UserName = userName,
                Email = userName,
                EmailConfirmed = true,
            };
            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                throw new Exception("Unable to create user.");
            return user;
        }

        public async Task<IdentityResult> AssignRoleToUser(string role, IdentityUser user)
        {
            var result = await userManager.AddToRoleAsync(user, role);
            if (!result.Succeeded)
                throw new Exception("Unable to assign user to role.");
            return result;
        }
    }
}
