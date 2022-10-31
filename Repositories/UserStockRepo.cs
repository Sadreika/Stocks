using Domain.DbContexts;
using Domain.Entities;
using Domain.Models;
using Repositories.Interfaces;

namespace Repositories
{
    public class UserStockRepo : GenericRepo<UserStock>, IUserStockRepo
    {
        private readonly StocksDbContext _context;

        public UserStockRepo(StocksDbContext context) : base(context)
        {
            _context = context;
        }

        public UserStock GetUserStockByStockId(int stockId)
        {
            return _context.UserStocks.FirstOrDefault(x => x.StockId == stockId);
        }

        public UserStock GetUserStockByUserId(int userId)
        {
            return _context.UserStocks.FirstOrDefault(x => x.UserId == userId);
        }
    }
}
