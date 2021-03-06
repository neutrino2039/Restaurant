#nullable disable

using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.WebApi.Models
{
    public class AppUser : IdentityUser
    {
        [Column(TypeName = "nvarchar(50)")]
        public string FirstName { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string LastName { get; set; }

        public bool IsDeleted { get; set; }

        public ICollection<Restaurant> Restaurants { get; set; }

        public ICollection<Review> Reviews { get; set; }
    }
}
