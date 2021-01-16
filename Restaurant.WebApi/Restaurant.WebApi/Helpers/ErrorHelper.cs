using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Restaurant.WebApi.Helpers
{
    public static class ErrorHelper
    {
        public static Dictionary<string, List<string>> CreateError(string key, string value)
        {
            return new Dictionary<string, List<string>>
            {
                [key] = new List<string> { value }
            };
        }
    }
}
