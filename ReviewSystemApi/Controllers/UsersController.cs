using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReviewSystemApi.Data;
using ReviewSystemApi.Models;
using ReviewSystemApi.Models.Dtos;

namespace ReviewSystemApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("create")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        try
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            {
                return BadRequest("Username already exists");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var user = new User
            {
                Username = dto.Username,
                PasswordHash = passwordHash,
                Email = dto.Email,
                Role = dto.Role,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User created successfully", userId = user.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{username}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(string username)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return NotFound("User not found");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("block/{username}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> BlockUser(string username, [FromBody] BlockUserDto dto)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return NotFound("User not found");
            }

            user.IsBlocked = dto.IsBlocked;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {(dto.IsBlocked ? "blocked" : "unblocked")} successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{username}")]
    public async Task<IActionResult> UpdateUser(string username, [FromBody] UpdateUserDto dto)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var currentUser = User.Identity!.Name;
            if (currentUser != username && !User.IsInRole("Admin"))
            {
                return Unauthorized("You can only update your own profile");
            }

            if (dto.Email != null) user.Email = dto.Email;
            if (dto.FullName != null) user.FullName = dto.FullName;
            if (dto.Location != null) user.Location = dto.Location;
            if (dto.Specialization != null) user.Specialization = dto.Specialization;

            await _context.SaveChangesAsync();
            return Ok(new { message = "User information updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers()
    {
        try
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    Role = u.Role.ToString(),
                    u.IsBlocked
                })
                .ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}