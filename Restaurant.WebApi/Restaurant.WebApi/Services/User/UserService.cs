using Microsoft.AspNetCore.Identity;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Services.Token;
using System;
using System.Threading.Tasks;
using static Restaurant.WebApi.Helpers.ErrorHelper;

namespace Restaurant.WebApi.Services.User
{
    public class UserService : IUserService
    {
        private RoleManager<IdentityRole> roleManager;
        private UserManager<IdentityUser> userManager;
        private ITokenService tokenService;

        public UserService(RoleManager<IdentityRole> roleManager, UserManager<IdentityUser> userManager, ITokenService tokenService)
        {
            this.roleManager = roleManager;
            this.userManager = userManager;
            this.tokenService = tokenService;
        }

        public async Task<IdentityResult> CreateRole(string role)
        {
            var result = await roleManager.CreateAsync(new IdentityRole(role));
            if (!result.Succeeded)
                throw new Exception("Unable to create role.");
            return result;
        }

        public async Task<IdentityUser> CreateUserWithRole(string userName, string password, string role)
        {
            var user = await CreateUser(userName, password);
            await AssignRoleToUser(role, user);
            return user;
        }

        private async Task<IdentityUser> CreateUser(string userName, string password)
        {
            if ((await userManager.FindByNameAsync(userName)) is not null)
                throw new Exception("Username is already taken.");

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

        private async Task<IdentityResult> AssignRoleToUser(string role, IdentityUser user)
        {
            var result = await userManager.AddToRoleAsync(user, role);
            if (!result.Succeeded)
                throw new Exception("Unable to assign user to role.");
            return result;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var invalidCredentialsReponse =
                new LoginResponse { Errors = CreateError("Login", "Invalid username or password.") };

            var user = await userManager.FindByNameAsync(request.Username);
            if (user == null) return invalidCredentialsReponse;

            if (!await userManager.CheckPasswordAsync(user, request.Password))
                return invalidCredentialsReponse;

            var role = (await userManager.GetRolesAsync(user))[0];

            return new LoginResponse
            {
                Message = "Logged in successfully.",
                Token = tokenService.GenerateToken(role, user)
            };
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
        {
            try
            {
                var user = await CreateUserWithRole(request.Username, request.Password, Roles.REGULAR);
                return new RegisterResponse
                {
                    Message = "User registraion was successful."
                };
            }
            catch (Exception e)
            {
                return new RegisterResponse
                {
                    Errors = CreateError("Register", e.Message),
                };
            }
        }
    }
}
