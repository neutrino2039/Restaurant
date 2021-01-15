using System;

namespace Restaurant.WebApi.Services.Date
{
    public class SystemDateService : IDateService
    {
        public DateTime Now => DateTime.Now;
    }
}
