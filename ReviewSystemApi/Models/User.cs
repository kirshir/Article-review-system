namespace ReviewSystemApi.Models;


public enum UserRole
{
    Author,
    Reviewer,
    Admin
}

public class User
{
    public int Id {get; set;}
    public string Username {get; set;} = string.Empty;
    public string PasswordHash {get; set;} = string.Empty;
    public UserRole Role {get; set;}
    public string Email {get; set;} = string.Empty;
    public string FullName {get; set;} = string.Empty;
    public string Specialization {get; set;} = string.Empty;
    public string Location {get; set;} = string.Empty;
    public DateTime CreatedAt {get; set;}
} 
