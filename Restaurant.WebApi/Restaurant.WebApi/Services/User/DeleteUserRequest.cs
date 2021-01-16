#nullable disable

using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.User
{
    public class DeleteUserRequest
    {
        [Required]
        public string Id { get; set; }
    }
}
