using Domain.Models;

namespace Repositories.Interfaces
{
    public interface IGenericRepo<TEntity> where TEntity : class
    {        
        Task<List<TEntity>> GetAllAsync();
        Task<MethodResult<TEntity>> CreateAsync(TEntity entity);
        Task<TEntity> GetByIdAsync(int id);
        Task<MethodResult<TEntity>> UpdateAsync(TEntity entity);
        Task DeleteAsync(int id);
        Task<bool> SaveAsync();
    }
}