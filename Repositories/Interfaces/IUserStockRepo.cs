using Domain.Entities;

namespace Repositories.Interfaces
{
    public interface IUserStockRepo : IGenericRepo<UserStock>
    {
        UserStock GetUserStockByStockId(int stockId);
        UserStock GetUserStockByUserId(int userId);
    }
}
