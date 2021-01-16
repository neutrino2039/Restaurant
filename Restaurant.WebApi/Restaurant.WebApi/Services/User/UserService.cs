using Microsoft.AspNetCore.Identity;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Models;
using Restaurant.WebApi.Services.Token;
using System;
using System.Linq;
using System.Threading.Tasks;
using static Restaurant.WebApi.Helpers.ErrorHelper;

namespace Restaurant.WebApi.Services.User
{
    public class UserService : IUserService
    {
        private RoleManager<IdentityRole> roleManager;
        private UserManager<AppUser> userManager;
        private ITokenService tokenService;

        public UserService(RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager, ITokenService tokenService)
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

        public async Task<AppUser> CreateUserWithRole(string userName, string password, string firstName, string lastName, string role)
        {
            var user = await CreateUser(userName, password, firstName, lastName);
            await AssignRoleToUser(role, user);
            return user;
        }

        private async Task<AppUser> CreateUser(string userName, string password, string firstName, string lastName)
        {
            if ((await userManager.FindByNameAsync(userName)) is not null)
                throw new Exception("Username is already taken.");

            var user = new AppUser
            {
                UserName = userName,
                Email = userName,
                EmailConfirmed = true,
                FirstName = firstName,
                LastName = lastName
            };
            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                throw new Exception("Unable to create user.");
            return user;
        }

        private async Task<IdentityResult> AssignRoleToUser(string role, AppUser user)
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
                Id = user.Id,
                Token = tokenService.GenerateToken(role, user)
            };
        }

        public async Task<CreateUserResponse> RegisterAsync(CreateUserRequest request)
        {
            try
            {
                var user = await CreateUserWithRole(
                    request.Username, 
                    request.Password, 
                    request.FirstName,
                    request.LastName,
                    Roles.REGULAR);
                return new CreateUserResponse
                {
                    Message = "User registration was successful."
                };
            }
            catch (Exception e)
            {
                return new CreateUserResponse
                {
                    Errors = CreateError("Register", e.Message),
                };
            }
        }

        public async Task<CreateUserResponse> CreateOwnerAsync(CreateUserRequest request)
        {
            try
            {
                var user = await CreateUserWithRole(
                    request.Username,
                    request.Password,
                    request.FirstName,
                    request.LastName,
                    Roles.OWNER);
                return new CreateUserResponse
                {
                    Message = "Owner creation was successful."
                };
            }
            catch (Exception e)
            {
                return new CreateUserResponse
                {
                    Errors = CreateError("CreateOwner", e.Message),
                };
            }
        }

        public async Task<UpdateUserResponse> UpdateUserAsync(UpdateUserRequest request)
        {
            var user = await userManager.FindByIdAsync(request.Id);
            if (user is null)
                return new UpdateUserResponse
                {
                    Errors = CreateError("EditUser", "Invalid user ID")
                };

            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return new UpdateUserResponse
                {
                    Errors = CreateError("EditUser", "Unable to update user.")
                };

            return new UpdateUserResponse
            {
                Message = "User update successful."
            };
        }

        public async Task<DeleteUserResponse> DeleteUserAsync(DeleteUserRequest request)
        {
            var userDeletedReponse = new DeleteUserResponse
            {
                Message = "User deletion successful."
            };

            var user = await userManager.FindByIdAsync(request.Id);
            if (user is null) return userDeletedReponse;

            var result = await userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return new DeleteUserResponse
                {
                    Errors = CreateError("DeleteUser", "Unable to delete user.")
                };

            return userDeletedReponse;
        }

        public async Task<GetUserResponse> GetUserByIdAsync(GetUserRequest request)
        {
            var user = await userManager.FindByIdAsync(request.Id);
            if (user is null)
                return new GetUserResponse
                {
                    Errors = CreateError("GetUserById", "User not found.")
                };

            return new GetUserResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }

        public async Task<GetAllUsersResponse> GetAllUsersAsync()
        {
            var users = await Task.Run(() => userManager.Users);
            var result = userManager.Users.Select(user => new GetUserResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName
            });
            return new GetAllUsersResponse { Users = result.ToList() };
        }

        public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
        {
            var invalidCredentialsReponse =
                new ResetPasswordResponse
                {
                    Errors = CreateError("ResetPassword", "Invalid id or password.")
                };

            var user = await userManager.FindByIdAsync(request.Id);
            if (user is null) return invalidCredentialsReponse;

            if (!await userManager.CheckPasswordAsync(user, request.OldPassword))
                return invalidCredentialsReponse;

            var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
            var result = await userManager.ResetPasswordAsync(user, resetToken, request.NewPassword);
            if (!result.Succeeded)
                return new ResetPasswordResponse
                {
                    Errors = CreateError("ResetPassword", "Unable to reset password.")
                };

            return new ResetPasswordResponse
            {
                Message = "Password reset successful."
            };
        }
    }
}
