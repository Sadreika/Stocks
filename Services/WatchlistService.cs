using AutoMapper;
using Domain.Dtos;
using Domain.Entities;
using Domain.Models;
using Repositories.Interfaces;
using Services.Interfaces;

namespace Services
{
    public class WatchlistService : IWatchlistService
    {
        private readonly IUserService _userService;
        private readonly IStockRepo _stockRepo;
        private readonly IWatchlistRepo _watchlistRepo;
        private readonly IWatchlistStockRepo _watchlistStockRepo;
        private readonly IMapper _mapper;

        public WatchlistService(IUserService userService, IStockRepo stockRepo, IWatchlistRepo watchlistRepo, IWatchlistStockRepo watchlistStockRepo, IMapper mapper)
        {
            _userService = userService;
            _stockRepo = stockRepo;
            _watchlistRepo = watchlistRepo;
            _watchlistStockRepo = watchlistStockRepo;
            _mapper = mapper;
        }

        public async Task<MethodResult<WatchlistDto>> CreateWatchlist(string stringToken, WatchlistDto watchlistDto)
        {
            var user = _userService.GetUser(stringToken);
            if (!user.Success)
            {
                return new MethodResult<WatchlistDto>()
                {
                    Success = false,
                    Message = user.Message
                };
            }

            watchlistDto.UserId = user.Content.Id;
            var repoResult = await _watchlistRepo.CreateAsync(_mapper.Map<WatchlistDto, Watchlist>(watchlistDto));

            return new MethodResult<WatchlistDto>()
            {
                Success = repoResult.Success,
                Content = _mapper.Map<Watchlist, WatchlistDto>(repoResult.Content)
            };
        }

        public async Task<MethodResult<WatchlistDto>> DeleteWatchlist(int id)
        {
            var watchlistStocks = _watchlistStockRepo.GetByWatchlistId(id);
            await _watchlistRepo.DeleteAsync(id);
            foreach (var watchlistStock in watchlistStocks)
            {
                await _watchlistStockRepo.DeleteAsync(watchlistStock.Id);
            }

            return new MethodResult<WatchlistDto>() { Success = await _watchlistRepo.SaveAsync() };
        }

        public MethodResult<List<WatchlistDto>> GetWatchlists(string stringToken)
        {
            var user = _userService.GetUser(stringToken);
            if (!user.Success)
            {
                return new MethodResult<List<WatchlistDto>>()
                {
                    Success = false,
                    Message = user.Message
                };
            }

            return new MethodResult<List<WatchlistDto>>()
            {
                Content = _mapper.Map<List<Watchlist>, List<WatchlistDto>>(_watchlistRepo.GetWatchlistsByUserId(user.Content.Id))
            };
        }

        public async Task<MethodResult<WatchlistStockDto>> AddStockToWatchlist(string stringToken, int stockId, int watchlistId)
        {
            var checkResult = CheckAccessToWatchlist(stringToken, watchlistId);
            if (!checkResult.Success)
            {
                return checkResult;
            }

            var repoResult = await _watchlistStockRepo.CreateAsync(new WatchlistStock() { StockId = stockId, WatchlistId = watchlistId });
            if (!repoResult.Success)
            {
                return new MethodResult<WatchlistStockDto>()
                {
                    Success = false,
                    Message = "Stock was not added to watchlist",
                };
            }

            return new MethodResult<WatchlistStockDto>()
            {
                Content = _mapper.Map<WatchlistStock, WatchlistStockDto>(repoResult.Content)
            };
        }

        public async Task<MethodResult<WatchlistStockDto>> DeleteStockFromWatchlist(string stringToken, int stockId, int watchlistId)
        {
            var checkResult = CheckAccessToWatchlist(stringToken, watchlistId);
            if (!checkResult.Success)
            {
                return checkResult;
            }

            var watchlistStocks = _watchlistStockRepo.GetByWatchlistId(watchlistId);
            var watchlistStock = watchlistStocks.FirstOrDefault(x => x.StockId == stockId);

            if (watchlistStock == null)
            {
                return new MethodResult<WatchlistStockDto>()
                {
                    Success = false,
                    Message = "Stock was not found in selected watchlist",
                };
            }

            await _watchlistStockRepo.DeleteAsync(watchlistStock.Id);

            return new MethodResult<WatchlistStockDto>()
            {
                Success = await _watchlistStockRepo.SaveAsync()
            };
        }

        private MethodResult<WatchlistStockDto> CheckAccessToWatchlist(string stringToken, int watchlistId)
        {
            var user = _userService.GetUser(stringToken);
            if (!user.Success)
            {
                return new MethodResult<WatchlistStockDto>()
                {
                    Success = false,
                    Message = user.Message
                };
            }

            var watchlists = _mapper.Map<List<Watchlist>, List<WatchlistDto>>(_watchlistRepo.GetWatchlistsByUserId(user.Content.Id));
            if (!watchlists.Any(x => x.Id == watchlistId))
            {
                return new MethodResult<WatchlistStockDto>()
                {
                    Success = false,
                    Message = "User does not have access to this watchlist",
                };
            }

            return new MethodResult<WatchlistStockDto>();
        }
    }
}
