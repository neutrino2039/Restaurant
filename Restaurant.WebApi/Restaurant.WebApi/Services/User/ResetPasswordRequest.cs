#nullable disable

using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.User
{
    public class ResetPasswordRequest
    {
        [Required]
        public string Id { get; set; }

        [Required]
        [StringLength(256, MinimumLength = 15)]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(256, MinimumLength = 15)]
        public string NewPassword { get; set; }
    }
}
