using Domain.Dtos;
using Domain.Models;

namespace Services.Interfaces
{
    public interface IWatchlistService
    {
        MethodResult<List<WatchlistDto>> GetWatchlists(string stringToken);
        Task<MethodResult<WatchlistDto>> CreateWatchlist(string stringToken, WatchlistDto watchlistDto);
        Task<MethodResult<WatchlistDto>> DeleteWatchlist(int id);
        Task<MethodResult<WatchlistStockDto>> AddStockToWatchlist(string stringToken, int stockId, int watchlistId);
        Task<MethodResult<WatchlistStockDto>> DeleteStockFromWatchlist(string stringToken, int stockId, int watchlistId);
    }
}
