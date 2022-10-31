using Domain.Dictionaries;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace Stocks.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class StockController : Controller
    {
        private readonly IStockService _stockService;

        public StockController(IStockService stockService)
        {
            _stockService = stockService;
        }

        [HttpGet]
        public async Task<IActionResult> GetStockByName(string name)
        {
            var stock = _stockService.GetStockByName(name);
            if (stock.Success)
            {
                return Ok(stock);
            }

            var symbol = StocksDictionary.Stocks[name];
            if (symbol == null)
            {
                return BadRequest("Stock was not found");
            }

            using var response = await new HttpClient().SendAsync(new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"https://yh-finance.p.rapidapi.com/stock/v2/get-financials?symbol={symbol}&region=US"),
                Headers = {
                    { "X-RapidAPI-Key", "cd60461fcbmsh0af02a35e8344e4p1a8fd6jsn1f6b11d17b93" },
                    { "X-RapidAPI-Host", "yh-finance.p.rapidapi.com" }
                }
            });

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Could not call stock API");
            }

            stock = await _stockService.CreateStockAsync(await response.Content.ReadAsStringAsync());
            return stock.Success ? Ok(stock) : BadRequest(stock.Message);
        }

        [HttpGet]
        public async Task<IActionResult> GetStocksByWatchlistId(string stringToken, int watchlistId)
        {
            var serviceResult = _stockService.GetStocksByWatchlistId(stringToken, watchlistId);
            return serviceResult.Success ? Ok(serviceResult) : BadRequest(serviceResult.Message);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStocks()
        {
            var serviceResult = await _stockService.GetAllStocks();
            return serviceResult.Success ? Ok(serviceResult) : BadRequest(serviceResult.Message);
        }
    }
}
