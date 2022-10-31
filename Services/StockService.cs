using AutoMapper;
using Domain.Dictionaries;
using Domain.Dtos;
using Domain.Entities;
using Domain.Models;
using Newtonsoft.Json.Linq;
using Repositories.Interfaces;
using Services.Interfaces;

namespace Services
{
    public class StockService : IStockService
    {
        private readonly IUserService _userService;
        private readonly IStockRepo _stockRepo;
        private readonly IWatchlistRepo _watchlistRepo;
        private readonly IMapper _mapper;

        public StockService(IUserService userService, IStockRepo stockRepo, IWatchlistRepo watchlistRepo, IMapper mapper)
        {
            _userService = userService;
            _stockRepo = stockRepo;
            _watchlistRepo = watchlistRepo;
            _mapper = mapper;
        }

        public MethodResult<StockDto> GetStockByName(string name)
        {
            var stock = _stockRepo.GetStockByName(name);
            if (stock == null)
            {
                return new MethodResult<StockDto>
                {
                    Success = false,
                    Message = "Stock not exists"
                };
            }

            return new MethodResult<StockDto>
            {
                Content = _mapper.Map<Stock, StockDto>(stock)
            };
        }

        public async Task<MethodResult<StockDto>> CreateStockAsync(string data)
        {
            try
            {
                var jData = JObject.Parse(data);
                var yieldParseResult = decimal.TryParse(jData["summaryDetail"]["yield"].ToString(), out decimal yield);
                var regularMarketPriceParseResult = decimal.TryParse(jData["price"]["regularMarketPrice"]["fmt"].ToString(), out decimal regularMarketPrice);

                var repoResult = await _stockRepo.CreateAsync(new Stock()
                {
                    Name = jData["price"]["longName"].ToString(),
                    Price = regularMarketPriceParseResult ? regularMarketPrice : 0.0m,
                    Currency = jData["price"]["currency"].ToString(),
                    Symbol = jData["quoteType"]["symbol"].ToString(),
                    Yield = yieldParseResult ? yield : 0.0m,
                    MarketCap = jData["summaryDetail"]["marketCap"]["fmt"].ToString()
                });

                return new MethodResult<StockDto>()
                {
                    Success = repoResult.Success,
                    Content = _mapper.Map<Stock, StockDto>(repoResult.Content)
                };
            }
            catch (Exception ex)
            {
                return new MethodResult<StockDto>() { Success = false, Message = "Could not parse response" };
            }
        }

        public MethodResult<List<StockDto>> GetStocksByWatchlistId(string stringToken, int watchlistId)
        {
            var user = _userService.GetUser(stringToken);
            if (!user.Success)
            {
                return new MethodResult<List<StockDto>>()
                {
                    Success = false,
                    Message = user.Message
                };
            }

            var watchlists = _watchlistRepo.GetWatchlistsByUserId(user.Content.Id);
            var canAccessWatchlist = false;
            foreach (var watchlist in watchlists)
            {
                if (watchlist.Id == watchlistId)
                {
                    canAccessWatchlist = true;
                    break;
                }
            }

            if (!canAccessWatchlist)
            {
                return new MethodResult<List<StockDto>>()
                {
                    Success = false,
                    Message = "User can not access this watchlist"
                };
            }

            var watchlistStocks = _stockRepo.GetStocksByWatchlistId(watchlistId);

            return new MethodResult<List<StockDto>>()
            {
                Content = _mapper.Map<List<Stock>, List<StockDto>>(watchlistStocks)
            };
        }

        public async Task<MethodResult<List<StockDto>>> GetAllStocks()
        {
            var stocks = await _stockRepo.GetAllAsync();

            return new MethodResult<List<StockDto>>()
            {
                Content = _mapper.Map<List<Stock>, List<StockDto>>(stocks)
            };
        }
    }
}
