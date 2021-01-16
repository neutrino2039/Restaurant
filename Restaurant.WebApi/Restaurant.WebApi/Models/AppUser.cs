#nullable disable

using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.WebApi.Models
{
    public class AppUser : IdentityUser
    {
        [Column(TypeName = "nvarchar(50)")]
        public string FirstName { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string LastName { get; set; }
    }
}
