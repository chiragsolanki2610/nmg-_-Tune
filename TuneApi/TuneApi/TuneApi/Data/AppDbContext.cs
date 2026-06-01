using Microsoft.EntityFrameworkCore;
using TuneApi.Models; // Pointing to your current project models

namespace TuneApi.Data // Fixed the namespace to match your project!
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Your existing User table
        public DbSet<User> Users => Set<User>();

        // Your brand new Tunes table connected to Supabase
        public DbSet<Tune> Tunes => Set<Tune>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ── User Entity Configuration ──
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users"); // Optional: lowercase to match standard PostgreSQL naming conventions

                entity.HasKey(u => u.Id);

                entity.Property(u => u.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(u => u.Email)
                      .IsRequired()
                      .HasMaxLength(255);

                // Enforce unique emails at the DB level
                entity.HasIndex(u => u.Email)
                      .IsUnique();

                entity.Property(u => u.PasswordHash)
                      .IsRequired();

                entity.Property(u => u.CreatedAt)
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // ── Tune Entity Configuration (Mapping to Supabase) ──
            modelBuilder.Entity<Tune>(entity =>
            {
                entity.ToTable("tunes"); // Maps class directly to the 'tunes' table in Supabase

                entity.HasKey(t => t.Id);

                entity.Property(t => t.Title)
                      .IsRequired();

                entity.Property(t => t.Artist)
                      .IsRequired();

                entity.Property(t => t.Genre)
                      .IsRequired();
            });
        }
    }
}