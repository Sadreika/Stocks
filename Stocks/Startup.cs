using Domain.DbContexts;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NLog;
using Repositories;
using Repositories.Interfaces;
using Services;
using Services.Interfaces;
using Stocks.Utilities;

namespace Stocks
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            LogManager.LoadConfiguration(string.Concat(Directory.GetCurrentDirectory(), "/nlog.config"));
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy", builder =>
                {
                    builder
                    .WithOrigins("http://localhost:3000")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
                });
            });

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "JwtBearer";
                options.DefaultChallengeScheme = "JwtBearer";
            })
           .AddJwtBearer("JwtBearer", jwtOptions =>
           {
               jwtOptions.TokenValidationParameters = new TokenValidationParameters()
               {
                   IssuerSigningKey = UserService.SigningKey,
                   ValidateIssuer = false,
                   ValidateAudience = false,
                   ValidateIssuerSigningKey = true,
                   ValidateLifetime = true,
                   ClockSkew = TimeSpan.FromMinutes(5)
               };
           });

            services.AddControllersWithViews();

            services.AddScoped<ILoggerService, LoggerService>();
            services.AddScoped<IStockService, StockService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IWatchlistService, WatchlistService>();

            services.AddTransient(typeof(IGenericRepo<>), typeof(GenericRepo<>));
            services.AddScoped<IStockRepo, StockRepo>();
            services.AddScoped<IUserRepo, UserRepo>();
            services.AddScoped<IUserStockRepo, UserStockRepo>();
            services.AddScoped<IWatchlistRepo, WatchlistRepo>();
            services.AddScoped<IWatchlistStockRepo, WatchlistStockRepo>();

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
            });

            services.AddDbContext<StocksDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("StocksDb"), b => b.MigrationsAssembly("Migrations")));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerService loggerService)
        {
            app.UseSwagger();

            if (env.IsDevelopment())
            {
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "WebApiDemo v1");
                    c.RoutePrefix = "swagger";
                });

                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();

            app.ConfigureExceptionHandler(loggerService);

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors("CorsPolicy");

            app.UseAuthorization();
            app.UseAuthentication();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}