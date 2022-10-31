using Domain.Entities;

namespace Repositories.Interfaces
{
    public interface IWatchlistRepo : IGenericRepo<Watchlist>
    {
        List<Watchlist> GetWatchlistsByUserId(int userId);
    }
}
