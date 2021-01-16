using Microsoft.AspNetCore.Mvc;
using Restaurant.WebApi.Services.Common;

namespace Restaurant.WebApi.Controllers
{
    public class ApiControllerBase : ControllerBase
    {
        [NonAction]
        public IActionResult ApiResult(ApiResponse response)
        {
            return response.Errors is null ? Ok(response) : BadRequest(response);
        }

        [NonAction]
        public IActionResult AuthorizationResult(ApiResponse response)
        {
            return response.Errors is null ? Ok(response) : Unauthorized(response);
        }
    }
}
