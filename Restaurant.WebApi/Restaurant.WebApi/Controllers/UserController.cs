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

        [HttpPost("Login")]
        public async Task<IActionResult> LoginAsync(LoginRequest request)
        {
            return AuthorizationResult(await userService.LoginAsync(request));
        }
    }
}
