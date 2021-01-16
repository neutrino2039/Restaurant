#nullable disable

using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.User
{
    public class LoginRequest
    {
        [Required]
        [StringLength(256, MinimumLength = 4)]
        public string Username { get; set; }

        [Required]
        [StringLength(256, MinimumLength = 15)]
        public string Password { get; set; }
    }
}
