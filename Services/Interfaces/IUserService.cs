using Domain.Dtos;
using Domain.Models;

namespace Services.Interfaces
{
    public interface IUserService
    {
        MethodResult<string> LogInUser(string email, string password);
        MethodResult<UserDto> GetUser(string email);
        Task<MethodResult<string>> ActivateUser(int id);
        Task<MethodResult<UserDto>> RegistrateUserAsync(UserDto userDto);
        Task<MethodResult<string>> ChangeUserPasswordAsync(int id, string password);
        Task<bool> DeleteUser(int id);
    }
}
