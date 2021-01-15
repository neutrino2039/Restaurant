using Microsoft.AspNetCore.Mvc;
using Restaurant.WebApi.Services.Common;

namespace Restaurant.WebApi.Controllers
{
    public class ApiControllerBase : ControllerBase
    {
        [NonAction]
        public IActionResult ApiResult(ApiResponse response)
        {
            return response.IsSuccess ? Ok(response) : BadRequest(response);
        }
    }
}
