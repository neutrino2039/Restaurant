#nullable disable

using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Review
{
    public class ReplyToReviewRequest
    {
        [Required]
        public int Id { get; set; }

        [StringLength(200)]
        public string Reply { get; set; }
    }
}
