using Domain.DbContexts;
using Domain.Entities;
using Repositories.Interfaces;

namespace Repositories
{
    public class WatchlistStockRepo : GenericRepo<WatchlistStock>, IWatchlistStockRepo
    {
        private readonly StocksDbContext _context;

        public WatchlistStockRepo(StocksDbContext context) : base(context)
        {
            _context = context;
        }

        public List<WatchlistStock> GetByWatchlistId(int watchlistId)
        {
            return _context.WatchlistStocks.Where(x => x.WatchlistId == watchlistId).ToList();
        }
    }
}
