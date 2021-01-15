using Microsoft.AspNetCore.Mvc;
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

        [HttpPost]
        public async Task<IActionResult> LoginAsync(LoginRequest request)
        {
            if (!ModelState.IsValid) return BadRequest("Invalid request.");

            return ApiResult(await userService.LoginAsync(request));
        }
    }
}
