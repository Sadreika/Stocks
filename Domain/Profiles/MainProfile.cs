using AutoMapper;
using Domain.Entities;
using Domain.Dtos;

namespace Domain.Profiles
{
    public class MainProfile : Profile
    {
        public MainProfile()
        {
            CreateMap<Stock, StockDto>().ReverseMap();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<UserStock, UserStockDto>().ReverseMap();
            CreateMap<Watchlist, WatchlistDto>().ReverseMap();
            CreateMap<WatchlistStock, WatchlistStockDto>().ReverseMap();
        }
    }
}
