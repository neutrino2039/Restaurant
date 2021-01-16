using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Restaurant.WebApi.Constants;
using Restaurant.WebApi.Services.User;
using System.Threading.Tasks;

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
        [HttpPost("CreateOwner")]
        public async Task<IActionResult> CreateOwnerAsync(CreateUserRequest request)
        {
            return ApiResult(await userService.CreateOwnerAsync(request));
        }

        [Authorize(Roles = Roles.ADMIN)]
        [HttpPost("UpdateUser")]
        public async Task<IActionResult> UpdateUserAsync(UpdateUserRequest request)
        {
            return ApiResult(await userService.UpdateUserAsync(request));
        }

    }
}
