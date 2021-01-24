#nullable disable

using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Review
{
    public class GetReviewByIdRequest
    {
        [Required]
        public int Id { get; set; }
    }
}
