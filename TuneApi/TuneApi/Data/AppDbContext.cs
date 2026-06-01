using Microsoft.EntityFrameworkCore;
using RegisterApi.Models;
using System.Reflection.Emit;

namespace RegisterApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Name)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(u => u.Username)
                  .IsRequired()
                  .HasMaxLength(50);

            entity.Property(u => u.Email)
                  .IsRequired()
                  .HasMaxLength(255);

            entity.Property(u => u.Bio)
                  .HasColumnType("text");

            entity.Property(u => u.ProfileImage)
                  .HasColumnType("text");

            entity.HasIndex(u => u.Username)
                  .IsUnique();

            // Enforce unique emails at the DB level
            entity.HasIndex(u => u.Email)
                  .IsUnique();

            entity.Property(u => u.PasswordHash)
                  .IsRequired();

            entity.Property(u => u.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });
    }
}
