namespace ReviewSystemApi.Models.Dtos;

public class CreateUserDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public string? FullName { get; set; } = string.Empty;
    public string? Specialization { get; set; } = string.Empty;
    public string? Location { get; set; } = string.Empty;
}
