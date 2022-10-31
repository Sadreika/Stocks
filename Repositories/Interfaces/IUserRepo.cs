using Domain.Entities;

namespace Repositories.Interfaces
{
    public interface IUserRepo : IGenericRepo<User>
    {
        User GetUserByEmail(string email);
    }
}

