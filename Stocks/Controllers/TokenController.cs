using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace Stocks.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class TokenController : Controller
    {
        [HttpGet]
        public IActionResult ValidateToken(string stringToken)
        {
            var token = new JwtSecurityTokenHandler().ReadJwtToken(stringToken);
            
            if (DateTime.UtcNow > token.ValidTo)
            {
                return Forbid();
            }

            return Ok();
        }
    }
}
