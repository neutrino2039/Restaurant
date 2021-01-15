using System;

namespace Restaurant.WebApi.Services.Date
{
    public interface IDateService
    {
        public DateTime Now { get; }
    }
}
