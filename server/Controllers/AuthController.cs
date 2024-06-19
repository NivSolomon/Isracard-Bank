using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.Dtos;
using server.Interfaces;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserDto req)
    {
        try
        {
            var token = await _userService.AuthenticateAsync(req.Email, req.Password);
            if (token == null)
            {
                return Unauthorized(new { message = "Invalid credentials" });
            }
            return Ok(new { token });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during login: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred during login" });
        }
    }

    [HttpGet("validate-token")]
    public IActionResult ValidateToken()
    {
        try
        {
            if (User.Identity.IsAuthenticated)
            {
                return Ok(new { valid = true });
            }
            return Unauthorized(new { valid = false });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error validating token: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred while validating token" });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        try
        {
            return Ok(new { message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during logout: {ex.Message}");
            return StatusCode(500, new { message = "An error occurred during logout" });
        }
    }
}
