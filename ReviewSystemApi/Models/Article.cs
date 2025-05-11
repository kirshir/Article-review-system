namespace ReviewSystemApi.Models;

public enum ArticleStatus
{
    Pending,
    UnderReview,
    Accepted,
    Rejected
}

public class Article
{
    public int Id {get; set;}
    public string Title {get; set;} = string.Empty;
    public string FilePath {get; set;} = string.Empty;
    public ArticleStatus Status {get; set;}
    public int AuthorId {get; set;}
    public User? Author {get; set;}
    public DateTime SubmissionDate {get; set;}
}
