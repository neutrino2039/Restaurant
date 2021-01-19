#nullable disable

using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Restaurant
{
    public class GetDetailsRequest
    {
        [Required]
        public int Id { get; set; }
    }
}
