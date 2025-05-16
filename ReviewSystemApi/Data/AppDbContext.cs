using Microsoft.EntityFrameworkCore;
using ReviewSystemApi.Models;

namespace ReviewSystemApi.Data;

public class AppDbContext : DbContext
{
    public DbSet<User> Users {get; set;}
    public DbSet<Article> Articles {get; set;}
    public DbSet<Review> Reviews {get; set;}

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>();

        modelBuilder.Entity<Article>()
            .Property(a => a.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Review>()
            .Property(r => r.Status)
            .HasConversion<string>();

        modelBuilder.Entity<Article>()
            .HasOne(a => a.Author)
            .WithMany()
            .HasForeignKey(a => a.AuthorId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Article)
            .WithOne(a => a.Review) 
            .HasForeignKey<Review>(r => r.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Reviewer)
            .WithMany()
            .HasForeignKey(r => r.ReviewerId)
            .OnDelete(DeleteBehavior.Cascade);    
            
        modelBuilder.Entity<User>()
            .Property(u => u.IsBlocked)
            .HasDefaultValue(false);
    }
}
