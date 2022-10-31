using Domain.Entities;

namespace Repositories.Interfaces
{
    public interface IStockRepo : IGenericRepo<Stock>
    {
        Stock GetStockByName(string stockName);
        List<Stock> GetStocksByWatchlistId(int watchlistId);
    }
}
