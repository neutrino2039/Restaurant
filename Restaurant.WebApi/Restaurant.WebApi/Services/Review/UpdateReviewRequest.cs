#nullable disable

using System;
using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Services.Review
{
    public class UpdateReviewRequest
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [Range(1, 5)]
        public int Stars { get; set; }

        [Required]
        [StringLength(200)]
        public string Comment { get; set; }

        [StringLength(200)]
        public string Reply { get; set; }
    }
}
