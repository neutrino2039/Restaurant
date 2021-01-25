using Microsoft.AspNetCore.Identity;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Models;
using Restaurant.WebApi.Services.Token;
using System;
using System.Collections.Generic;
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
                throw new Exception("User name is already taken.");

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
                new LoginResponse { Errors = CreateError("Login", "Invalid user name or password.") };

            var user = await userManager.FindByNameAsync(request.UserName);
            if (user == null) return invalidCredentialsReponse;

            if (!await userManager.CheckPasswordAsync(user, request.Password))
                return invalidCredentialsReponse;

            var role = (await userManager.GetRolesAsync(user))[0];

            return new LoginResponse
            {
                Message = "Logged in successfully.",
                Id = user.Id,
                Token = tokenService.GenerateToken(role, user),
                Role = role
            };
        }

        public async Task<CreateUserResponse> RegisterAsync(CreateUserRequest request)
        {
            try
            {
                var user = await CreateUserWithRole(
                    request.UserName,
                    request.Password,
                    request.FirstName,
                    request.LastName,
                    Roles.REGULAR);
                var loginResponse = await LoginAsync(new LoginRequest { UserName = request.UserName, Password = request.Password });
                return new CreateUserResponse
                {
                    Message = "User registration was successful.",
                    Id = loginResponse.Id,
                    Token = loginResponse.Token,
                    Role = loginResponse.Role
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

        public async Task<CreateUserResponse> CreateUserAsync(CreateUserRequest request)
        {
            if (request.Role == Roles.ADMIN)
                return new CreateUserResponse
                {
                    Errors = CreateError("CreateUser", "Invalid role."),
                };

            if (string.IsNullOrEmpty(request.Role))
                request.Role = Roles.REGULAR;

            var allowedRoles = new[] { Roles.OWNER, Roles.REGULAR };
            if (!allowedRoles.Contains(request.Role))
                return new CreateUserResponse
                {
                    Errors = CreateError("CreateUser", "Inavalid role."),
                };

            try
            {
                var user = await CreateUserWithRole(
                    request.UserName,
                    request.Password,
                    request.FirstName,
                    request.LastName,
                    request.Role);
                return new CreateUserResponse
                {
                    Message = "User creation was successful."
                };
            }
            catch (Exception e)
            {
                return new CreateUserResponse
                {
                    Errors = CreateError("CreateUser", e.Message),
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

            if (!string.IsNullOrEmpty(request.Password))
            {
                var resetToken = await userManager.GeneratePasswordResetTokenAsync(user);
                result = await userManager.ResetPasswordAsync(user, resetToken, request.Password);
                if (!result.Succeeded)
                    return new UpdateUserResponse
                    {
                        Errors = CreateError("EditUser", "Unable to reset password.")
                    };
            }

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

            var role = (await userManager.GetRolesAsync(user))[0];

            return new GetUserResponse
            {
                Id = user.Id,
                UserName = user.UserName,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = role
            };
        }

        public async Task<GetAllUsersResponse> GetAllUsersAsync()
        {
            var roles = await Task.Run(() => roleManager.Roles.OrderBy(r => r.Name).ToList());
            var users = new List<GetUserResponse>();
            foreach(var role in roles)
            {
                var usersInRole = await userManager.GetUsersInRoleAsync(role.Name);
                users.AddRange(usersInRole.Select(user => new GetUserResponse
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = role.Name
                }));
            }
            return new GetAllUsersResponse { Users = users };
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
