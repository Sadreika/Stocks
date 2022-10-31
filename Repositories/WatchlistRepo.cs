using Domain.DbContexts;
using Domain.Entities;
using Repositories.Interfaces;

namespace Repositories
{
    public class WatchlistRepo : GenericRepo<Watchlist>, IWatchlistRepo
    {
        private readonly StocksDbContext _context;

        public WatchlistRepo(StocksDbContext context) : base(context)
        {
            _context = context;
        }

        public List<Watchlist> GetWatchlistsByUserId(int userId)
        {
           return _context.Watchlists.Where(x => x.UserId == userId).ToList();
        }
    }
}
