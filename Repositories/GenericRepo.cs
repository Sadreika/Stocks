using Domain.DbContexts;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories
{
    public class GenericRepo<TEntity> : IGenericRepo<TEntity> where TEntity : class
    {
        private readonly StocksDbContext _context;
        private readonly DbSet<TEntity> dbSet;

        public GenericRepo(StocksDbContext context)
        {
            _context = context;
            dbSet = context.Set<TEntity>();
        }

        public virtual async Task<List<TEntity>> GetAllAsync()
        {
            return await dbSet.ToListAsync();
        }

        public virtual async Task<MethodResult<TEntity>> CreateAsync(TEntity entity)
        {
            dbSet.Add(entity);
            var success = await _context.SaveChangesAsync() >= 0;
            return new MethodResult<TEntity>() { Content = entity, Success = success };
        }

        public virtual async Task<TEntity> GetByIdAsync(int id)
        {
            return await dbSet.FindAsync(id);
        }

        public async Task<MethodResult<TEntity>> UpdateAsync(TEntity entity)
        {
            dbSet.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
            var success = await _context.SaveChangesAsync() >= 0;

            return new MethodResult<TEntity>() { Content = entity, Success = success };
        }

        public async Task DeleteAsync(int id)
        {
            _context.Remove(await dbSet.FindAsync(id));
        }

        public async Task<bool> SaveAsync()
        {
            return await _context.SaveChangesAsync() >= 0;
        }
    }
}