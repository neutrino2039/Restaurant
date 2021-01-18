#nullable disable

using Restaurant.WebApi.Services.Common;
using System.Collections.Generic;

namespace Restaurant.WebApi.Services.Review
{
    public class GetAllReviewsResponse : ApiResponse
    {
        public List<GetReviewResponse> Reviews { get; set; }
    }
}
