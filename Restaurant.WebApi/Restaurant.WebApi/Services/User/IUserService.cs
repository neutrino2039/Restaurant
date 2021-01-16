using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace Restaurant.WebApi.Services.User
{
    public interface IUserService
    {
        Task<IdentityResult> CreateRole(string role);
        Task<IdentityUser> CreateUserWithRole(string userName, string password, string role);
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<RegisterResponse> RegisterAsync(RegisterRequest request);
    }
}
