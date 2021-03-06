using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Services.User;
using System.Threading.Tasks;
using static Restaurant.WebApi.Helpers.ErrorHelper;

namespace Restaurant.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ApiControllerBase
    {
        private IUserService userService;

        public UserController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> LoginAsync(LoginRequest request)
        {
            return AuthorizationResult(await userService.LoginAsync(request));
        }

        [HttpPost("Register")]
        public async Task<IActionResult> RegisterAsync(CreateUserRequest request)
        {
            return ApiResult(await userService.RegisterAsync(request));
        }

        [Authorize(Roles = Roles.ADMIN)]
        [HttpPost("Create")]
        public async Task<IActionResult> CreateUserAsync(CreateUserRequest request)
        {
            return ApiResult(await userService.CreateUserAsync(request));
        }

        [Authorize(Roles = Roles.ADMIN)]
        [HttpPost("Update")]
        public async Task<IActionResult> UpdateUserAsync(UpdateUserRequest request)
        {
            return ApiResult(await userService.UpdateUserAsync(request));
        }

        [Authorize(Roles = Roles.ADMIN)]
        [HttpPost("Delete")]
        public async Task<IActionResult> DeleteUserAsync(DeleteUserRequest request)
        {
            return ApiResult(await userService.DeleteUserAsync(request));
        }

        [Authorize(Roles = Roles.ALL)]
        [HttpGet("GetById")]
        public async Task<IActionResult> GetUserByIdAsync([FromQuery]GetUserRequest request)
        {
            if (CurrentUserNotAuthorizedFor(request.Id))
                return AuthorizationResult(new GetUserResponse
                {
                    Errors = CreateError("GetUserById", "Unauthorized access.")
                });

            return ApiResult(await userService.GetUserByIdAsync(request));
        }

        private bool CurrentUserNotAuthorizedFor(string userId)
        {
            return !User.IsInRole(Roles.ADMIN) && User.Identity?.Name != userId;
        }

        [Authorize(Roles = Roles.ADMIN)]
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllUsersAsync()
        {
            return ApiResult(await userService.GetAllUsersAsync());
        }

        [Authorize(Roles = Roles.ALL)]
        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPasswordAsync(ResetPasswordRequest request)
        {
            if (CurrentUserNotAuthorizedFor(request.Id))
                return AuthorizationResult(new ResetPasswordResponse
                {
                    Errors = CreateError("ResetPassword", "Unauthorized access.")
                });

            return ApiResult(await userService.ResetPasswordAsync(request));
        }
    }
}
