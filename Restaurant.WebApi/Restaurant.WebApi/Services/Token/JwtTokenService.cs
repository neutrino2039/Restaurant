using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Restaurant.WebApi.Services.DateTime;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Restaurant.WebApi.Services.Token
{
    public class JwtTokenService : ITokenService
    {

        private IConfiguration configuration;
        private IDateTimeService dateTimeService;

        public JwtTokenService(IConfiguration configuration, IDateTimeService dateTimeService)
        {
            this.configuration = configuration;
            this.dateTimeService = dateTimeService;
        }

        public string GenerateToken(string role, IdentityUser user)
        {
            var audience = configuration["Authentication:Audience"];
            var issuer = configuration["Authentication:Issuer"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Authentication:Key"]));
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Id),
                new Claim(ClaimTypes.Role, role)
            };
            var token = new JwtSecurityToken(
                audience: audience,
                issuer: issuer,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256),
                claims: claims,
                expires: dateTimeService.Now.AddDays(30));

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
