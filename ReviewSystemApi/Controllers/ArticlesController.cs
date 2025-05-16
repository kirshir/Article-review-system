using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReviewSystemApi.Data;
using ReviewSystemApi.Models;
using ReviewSystemApi.Models.Dtos;

namespace ReviewSystemApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Author")]
public class ArticlesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ArticlesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] ArticleCreateDto dto)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity!.Name);
            if (user == null)
            {
                return Unauthorized();
            }

            var fileExtension = Path.GetExtension(dto.File.FileName).ToLower();
            if (fileExtension != ".pdf" && fileExtension != ".docx")
            {
                return BadRequest("Only PDF or DOCX files are allowed");
            }

            var fileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            var article = new Article
            {
                Title = dto.Title,
                FilePath = filePath,
                Status = ArticleStatus.Pending,
                AuthorId = user.Id,
                SubmissionDate = DateTime.UtcNow
            };

            _context.Articles.Add(article);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Article uploaded successfully", articleId = article.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}