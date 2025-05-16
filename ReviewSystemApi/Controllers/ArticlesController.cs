using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReviewSystemApi.Data;
using ReviewSystemApi.Models;
using ReviewSystemApi.Models.Dtos;

namespace ReviewSystemApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ArticlesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ArticlesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("upload")]
    [Authorize(Roles = "Author")]
    public async Task<IActionResult> Upload([FromForm] ArticleCreateDto dto)
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity!.Name);
            if (user == null || user.IsBlocked)
            {
                return Unauthorized("User is blocked or not found");
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

    [HttpGet]
    [Authorize(Roles = "Reviewer,Admin")]
    public async Task<IActionResult> GetArticles()
    {
        var articles = await _context.Articles
            .Where(a => a.Status == ArticleStatus.Pending)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.SubmissionDate,
                AuthorName = a.Author!.Username
            })
            .ToListAsync();

        return Ok(articles);
    }

    [HttpGet("my-articles")]
    [Authorize(Roles = "Author")]
    public async Task<IActionResult> GetMyArticles()
    {
        try
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity!.Name);
            if (user == null)
            {
                return Unauthorized("User not found");
            }

            var articles = await _context.Articles
                .Where(a => a.AuthorId == user.Id)
                .Select(a => new
                {
                    a.Id,
                    a.Title,
                    a.Status,
                    a.SubmissionDate,
                    Review = a.Review != null ? new
                    {
                        a.Review.Id,
                        ReviewerName = a.Review.Reviewer!.Username,
                        a.Review.ReviewText,
                        a.Review.Status,
                        a.Review.ReviewDate
                    } : null
                })
                .ToListAsync();

            return Ok(articles);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteArticle(int id)
    {
        try
        {
            var article = await _context.Articles.FirstOrDefaultAsync(a => a.Id == id);
            if (article == null)
            {
                return NotFound("Article not found");
            }

            if (System.IO.File.Exists(article.FilePath))
            {
                System.IO.File.Delete(article.FilePath); 
            }

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Article deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}