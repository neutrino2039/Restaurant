using Microsoft.AspNetCore.Identity;
using Restaurant.WebApi.Models;
using System.Threading.Tasks;

namespace Restaurant.WebApi.Services.User
{
    public interface IUserService
    {
        Task<IdentityResult> CreateRole(string role);
        Task<AppUser> CreateUserWithRole(string userName, string password, string firstName, string lastName, string role);
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<CreateUserResponse> RegisterAsync(CreateUserRequest request);
    }
}
