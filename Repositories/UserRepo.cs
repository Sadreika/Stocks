using Domain.DbContexts;
using Domain.Entities;
using Domain.Models;
using Repositories.Interfaces;

namespace Repositories
{
    public class UserRepo : GenericRepo<User>, IUserRepo
    {
        private readonly StocksDbContext _context;

        public UserRepo(StocksDbContext context) : base(context)
        {
            _context = context;
        }

        public User GetUserByEmail(string email)
        {
            return _context.Users.FirstOrDefault(x => x.Email == email);
        }
    }
}
