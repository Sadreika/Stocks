using AutoMapper;
using Domain.Dtos;
using Domain.Entities;
using Domain.Models;
using Repositories.Interfaces;
using Services.Interfaces;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepo _userRepositories;
        private readonly IMapper _mapper;

        public static readonly SymmetricSecurityKey SigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("this is my custom Secret key for authentication"));

        public UserService(IUserRepo userRepositories, IMapper mapper)
        {
            _userRepositories = userRepositories;
            _mapper = mapper;
        }

        public async Task<MethodResult<UserDto>> RegistrateUserAsync(UserDto userDto)
        {
            var validationResult = ValidateNewUser(userDto.Email);
            if (!validationResult.Success)
            {
                return validationResult;
            }

            var repoResult = await _userRepositories.CreateAsync(
                new User()
                {
                    Email = userDto.Email,
                    Name = userDto.Name,
                    Surname = userDto.Surname,
                    Password = HashPassword(userDto.Password),
                    Activated = false,
                    Username = userDto.Username
                });

            return repoResult.Success
                ? new MethodResult<UserDto>()
                : new MethodResult<UserDto> { Success = false, Message = "Could not save user" };
        }
        private MethodResult<UserDto> ValidateNewUser(string email)
        {
            var user = _userRepositories.GetUserByEmail(email);

            if (user != null)
            {
                return new MethodResult<UserDto>() { Success = false, Message = "Email is in used" };
            }

            return new MethodResult<UserDto>() { Success = true, Message = "Email is available" };
        }
        private string HashPassword(string password)
        {
            using SHA512 sha512Hash = SHA512.Create();
            byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
            byte[] hashBytes = sha512Hash.ComputeHash(passwordBytes);

            return BitConverter.ToString(hashBytes).Replace("-", String.Empty);
        }
        public async Task<MethodResult<string>> ActivateUser(int id)
        {
            var user = await _userRepositories.GetByIdAsync(id);

            if (user == null)
            {
                return new MethodResult<string>() { Success = false, Message = "User does not exist" };
            }

            user.Activated = true;
            await _userRepositories.SaveAsync();
            return new MethodResult<string>() { Success = true, Message = "User activated" };
        }
        public MethodResult<string> LogInUser(string email, string password)
        {
            var user = _userRepositories.GetUserByEmail(email);

            if (user == null)
            {
                return new MethodResult<string>() { Success = false, Message = "User does not exist" };
            }

            var hashedPassword = HashPassword(password);

            if (user.Password != hashedPassword)
            {
                return new MethodResult<string>() { Success = false, Message = "Password is incorrect" };
            }

            return new MethodResult<string>() { Content = GenerateToken(email) };
        }
        private string GenerateToken(string email)
        {
            var token = new JwtSecurityToken(
                claims: new Claim[]
                {
                    new Claim(ClaimTypes.Email, email)
                },
                notBefore: DateTime.Now,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: new SigningCredentials(SigningKey, SecurityAlgorithms.HmacSha256));

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public MethodResult<UserDto> GetUser(string stringToken)
        {
            var token = new JwtSecurityTokenHandler().ReadJwtToken(stringToken);
            var email = token.Payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"].ToString();
            if (email == null)
            {
                return new MethodResult<UserDto>() { Success = false, Message = "Email is not valid" };
            }

            var user = _userRepositories.GetUserByEmail(email);
            var userDto = _mapper.Map<User, UserDto>(user);
            userDto.Password = "";

            return new MethodResult<UserDto>() {
                Content = userDto
            };
        }
        public async Task<MethodResult<string>> ChangeUserPasswordAsync(int id, string password)
        {
            var user = await _userRepositories.GetByIdAsync(id);

            if (user == null)
            {
                return new MethodResult<string>() { Success = false, Message = "User does not exist" };
            }

            user.Password = HashPassword(password);
            await _userRepositories.SaveAsync();
            return new MethodResult<string>();
        }
        public async Task<bool> DeleteUser(int id)
        {
            await _userRepositories.DeleteAsync(id);
            return await _userRepositories.SaveAsync();
        }
    }
}
