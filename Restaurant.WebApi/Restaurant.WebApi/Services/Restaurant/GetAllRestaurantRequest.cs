#nullable disable

namespace Restaurant.WebApi.Services.Restaurant
{
    public class GetAllRestaurantRequest
    {
        public bool Sort { get; set; } = true;

        public SortDirection SortDirection { get; set; }

        public bool Filter { get; set; } = false;

        public int StarsFrom { get; set; }

        public int StarsTo { get; set; }
    }

    public enum SortDirection
    {
        Asc,
        Desc
    }
}
