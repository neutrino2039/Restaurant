using System;

namespace Restaurant.WebApi.Services.DateTime
{
    public class UtcDateTimeService : IDateTimeService
    {
        public System.DateTime Now => System.DateTime.UtcNow;
    }
}
