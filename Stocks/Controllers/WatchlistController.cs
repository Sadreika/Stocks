using Domain.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace Stocks.Controllers
{

    [ApiController]
    [Route("[controller]/[action]")]
    public class WatchlistController : Controller
    {
        private readonly IWatchlistService _watchlistService;

        public WatchlistController(IWatchlistService watchlistService)
        {
            _watchlistService = watchlistService;
        }

        [HttpPost]
        public async Task<IActionResult> AddStockToWatchlist(string stringToken, int stockId, int watchlistId)
        {
            var serviceResult = await _watchlistService.AddStockToWatchlist(stringToken, stockId, watchlistId);
            return serviceResult.Success ? Ok(serviceResult) : BadRequest(serviceResult.Message);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteStockFromWatchlist(string stringToken, int stockId, int watchlistId)
        {
            var serviceResult = await _watchlistService.DeleteStockFromWatchlist(stringToken, stockId, watchlistId);
            return serviceResult.Success ? Ok(serviceResult) : BadRequest(serviceResult.Message);
        }

        [HttpGet]
        public async Task<IActionResult> GetWatchlists(string stringToken)
        {
            var serviceResult = _watchlistService.GetWatchlists(stringToken);
            return serviceResult.Success ? Ok(serviceResult) : BadRequest(serviceResult.Message);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWatchlist(string stringToken, [FromBody] WatchlistDto watchlistDto)
        {
            var serviceResult = await _watchlistService.CreateWatchlist(stringToken, watchlistDto);
            return serviceResult.Success ? Ok(serviceResult) : BadRequest(serviceResult.Message);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteWatchlist(int id)
        {
            var serviceResult = await _watchlistService.DeleteWatchlist(id);
            return serviceResult.Success ? Ok(serviceResult.Message) : BadRequest(serviceResult.Message);
        }
    }
}
