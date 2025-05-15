using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReviewSystemApi.Data;
using ReviewSystemApi.Models;
using ReviewSystemApi.Models.Dtos;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;

namespace ReviewSystemApi.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto, string? currentUserName);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, string? currentUserName)
    {
        if (dto.Role == UserRole.Admin)
        {
            if (string.IsNullOrEmpty(currentUserName))
            {
                throw new Exception("Authentication required to create admin users");
            }

            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == currentUserName);
            if (currentUser == null || currentUser.Role != UserRole.Admin)
            {
                throw new Exception("Only admins can create admin users");
            }
        }
        
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username || u.Email == dto.Email))
        {
            throw new Exception("Username or email already exists");
        }

        //хэширование пароля
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = passwordHash,
            Email = dto.Email,
            FullName = dto.FullName,
            Specialization = dto.Specialization,
            Location = dto.Location,
            Role = dto.Role,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        //генерация JWT
        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Role = user.Role.ToString()
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        // Поиск пользователя
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new Exception("Invalid username or password");
        }

        //генерация JWT
        var token = GenerateJwtToken(user);

        return new AuthResponseDto
        {
            Token = token,
            Role = user.Role.ToString()
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:ExpiryInMinutes"]!)),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

 