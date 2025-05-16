using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReviewSystemApi.Data;

namespace ReviewSystemApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TestController : ControllerBase
{
    private readonly AppDbContext _context;

    public TestController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = $"Hello, {User.Identity!.Name}! You are authenticated." });
    }

    [HttpGet("admin")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAdmin()
    {
        return Ok(new { message = "Hello, Admin! You have admin access." });
    }

    [HttpGet("author")]
    [Authorize(Roles = "Author")]
    public IActionResult GetAuthor()
    {
        return Ok(new { message = "Hello, Author! You have author access." });
    }
}