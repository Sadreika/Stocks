using Domain.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace Stocks.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> LoginUser([FromBody] UserDto user)
        {
            var serviceResult = _userService.LogInUser(user.Email, user.Password);
            return serviceResult.Success ? Ok(serviceResult) : BadRequest(serviceResult.Message);
        }

        [HttpGet]
        public async Task<IActionResult> GetUser(string stringToken)
        {
            var serviceResult = _userService.GetUser(stringToken);
            return serviceResult.Success ? Ok(serviceResult) : BadRequest(serviceResult.Message);
        }

        [HttpPost]
        public async Task<IActionResult> ActivateUser(int id)
        {
            var serviceResult = await _userService.ActivateUser(id);
            return serviceResult.Success ? Ok(serviceResult.Message) : BadRequest(serviceResult.Message);
        }

        [HttpPost]
        public async Task<IActionResult> RegistrateUser([FromBody] UserDto user)
        {
            var serviceResult = await _userService.RegistrateUserAsync(user);
            return serviceResult.Success ? Ok(serviceResult) : BadRequest(serviceResult.Message);
        }

        [HttpPut]
        public async Task<IActionResult> ChangeUserPassword(int id, string password)
        {
            var serviceResult = await _userService.ChangeUserPasswordAsync(id, password);
            return serviceResult.Success ? Ok(serviceResult.Message) : BadRequest(serviceResult.Message);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int id)
        {
            return await _userService.DeleteUser(id) ? Ok("User deleted") : BadRequest("Unable to delete user");
        }
    }
}
