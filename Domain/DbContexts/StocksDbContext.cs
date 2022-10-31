using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Domain.DbContexts
{
    public class StocksDbContext: DbContext
    {
        public StocksDbContext(DbContextOptions<StocksDbContext> options):base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Watchlist> Watchlists { get; set; }
        public DbSet<UserStock> UserStocks { get; set; }
        public DbSet<WatchlistStock> WatchlistStocks { get; set; }
    }
}

