namespace ReviewSystemApi.Models.Dtos;

public class ArticleCreateDto
{
    public string Title { get; set; } = string.Empty;
    public IFormFile File { get; set; } = null!; // загружаемый файл (PDF или DOCX) 
}
