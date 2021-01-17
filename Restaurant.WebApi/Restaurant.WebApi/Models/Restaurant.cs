#nullable disable

using System.ComponentModel.DataAnnotations.Schema;

namespace Restaurant.WebApi.Models
{
    public class Restaurant
    {
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Name { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Address { get; set; }

        [Column(TypeName = "nvarchar(256)")]
        public string Image { get; set; }

        public AppUser Owner { get; set; }
        public string OwnerId { get; set; }
    }
}
