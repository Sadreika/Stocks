using Domain.Entities;

namespace Repositories.Interfaces
{
    public interface IWatchlistStockRepo : IGenericRepo<WatchlistStock>
    {
        List<WatchlistStock> GetByWatchlistId(int watchlistId);
    }
}
