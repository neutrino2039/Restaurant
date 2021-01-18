#nullable disable

using System;
using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Review
{
    public class CreateReviewRequest
    {
        [Required]
        public int RestaurantId { get; set; }

        [Required]
        [Range(1, 5)]
        public int Stars { get; set; }

        [Required]
        [StringLength(200)]
        public string Comment { get; set; }
    }
}
