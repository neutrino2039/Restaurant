using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Review
{
    public class DeleteReviewRequest
    {
        [Required]
        public int Id { get; set; }
    }
}
