namespace ReviewSystemApi.Models;

public class ReviewAssignment
{
    public int Id { get; set; }
    public int ArticleId { get; set; }
    public Article? Article { get; set; }
    public int ReviewerId { get; set; }
    public User? Reviewer { get; set; }
    public bool Declined { get; set; } = false; 
    public DateTime AssignedAt { get; set; }
}