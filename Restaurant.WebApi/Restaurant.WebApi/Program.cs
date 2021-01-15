using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Restaurant.WebApi.Seeders;
using System;

namespace Restaurant.WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            SeedData(host);
            host.Run();
        }

        private static void SeedData(IHost host)
        {
            var serviceProvider = host.Services.CreateScope().ServiceProvider;
            try
            {
                Seeder.SeedDataAsync(serviceProvider).Wait();
            }
            catch(Exception e)
            {
                var logger = serviceProvider.GetRequiredService<ILogger<Program>>();
                logger.LogError(e, "An error occurred seeding the DB.");
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
