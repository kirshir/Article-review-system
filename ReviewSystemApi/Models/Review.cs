namespace ReviewSystemApi.Models;

public enum ReviewStatus
{
    Accepted,
    Rejected
}

public class Review
{
    public int Id {get; set;}
    public int ArticleId {get; set;}
    public Article? Article {get; set;}
    public int ReviewerId {get; set;}
    public User? Reviewer {get; set;}
    public string ReviewText {get; set;} = string.Empty;
    public ReviewStatus Status {get; set;} 
    public DateTime ReviewDate {get; set;}
}
