using Domain.DbContexts;
using Domain.Entities;
using Domain.Models;
using Repositories.Interfaces;

namespace Repositories
{
    public class StockRepo : GenericRepo<Stock>, IStockRepo
    {
        private readonly StocksDbContext _context;

        public StockRepo(StocksDbContext context) : base(context)
        {
            _context = context;
        }

        public Stock GetStockByName(string stockName)
        {
            return _context.Stocks.FirstOrDefault(x => x.Name == stockName);
        }

        public List<Stock> GetStocksByWatchlistId(int watchlistId)
        {
            var stocks = new List<Stock>();
            var watchlistStocks = _context.WatchlistStocks.Where(x => x.WatchlistId == watchlistId).ToList();
            foreach(var watchlistStock in watchlistStocks)
            {
                var stock = _context.Stocks.FirstOrDefault(x => x.Id == watchlistStock.StockId);
                if (stock == null) continue;
                stocks.Add(stock);
            }

            return stocks;
        }
    }
}