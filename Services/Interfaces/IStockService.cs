using Domain.Dtos;
using Domain.Models;

namespace Services.Interfaces
{
    public interface IStockService
    {
        MethodResult<StockDto> GetStockByName(string name);
        MethodResult<List<StockDto>> GetStocksByWatchlistId(string stringToken, int watchlistId);
        Task<MethodResult<List<StockDto>>> GetAllStocks();
        Task<MethodResult<StockDto>> CreateStockAsync(string data);
    }
}
