using Microsoft.AspNetCore.Identity;

namespace Restaurant.WebApi.Services.Token
{
    public interface ITokenService
    {
        public string GenerateToken(string role, IdentityUser user);
    }
}
