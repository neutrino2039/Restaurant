#nullable disable

using System;
using System.ComponentModel.DataAnnotations;

namespace Restaurant.WebApi.Models
{
    public class Review
    {
        public int Id { get; set; }

        public Restaurant Restaurant { get; set; }
        public int RestaurantId { get; set; }

        public AppUser User { get; set; }
        [Required]
        public string UserId { get; set; }

        public int Stars { get; set; }

        public DateTime VisitDate { get; set; }

        [Required]
        public string Comment { get; set; }

        public string Reply { get; set; }
    }
}
