namespace ReviewSystemApi.Models.Dtos;

public class ReviewCreateDto
{
    public int ArticleId { get; set; }
    public string ReviewText { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
} 
