using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReviewSystemApi.Data;
using ReviewSystemApi.Models;
using ReviewSystemApi.Models.Dtos;

namespace ReviewSystemApi.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Reviewer")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto dto)
    {
        try
        {
            var reviewer = await _context.Users.FirstOrDefaultAsync(u => u.Username == User.Identity!.Name);
            if (reviewer == null || reviewer.IsBlocked)
            {
                return Unauthorized("User is blocked or not found");
            }

            var article = await _context.Articles.FirstOrDefaultAsync(a => a.Id == dto.ArticleId);
            if (article == null || article.Status != ArticleStatus.Pending)
            {
                return BadRequest("Article not found or not available for review");
            }

            if (article.Review != null)
            {
                return BadRequest("Article already has a review");
            }

            var review = new Review
            {
                ArticleId = dto.ArticleId,
                ReviewerId = reviewer.Id,
                ReviewText = dto.ReviewText,
                Status = dto.IsApproved ? ReviewStatus.Accepted : ReviewStatus.Rejected,
                ReviewDate = DateTime.UtcNow
            };

            article.Status = dto.IsApproved ? ArticleStatus.Accepted : ArticleStatus.Rejected;
            article.Review = review;

            _context.Reviews.Add(review);
            _context.Articles.Update(article);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Review submitted successfully", reviewId = review.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
