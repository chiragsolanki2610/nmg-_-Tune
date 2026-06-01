using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TuneApi.Models
{
    [Table("tunes")] // Tells EF Core to look for the "tunes" table in Supabase
    public class Tune
    {
        [Key] // Tells EF Core this is your Primary Key
        [Column("id")]
        public Guid Id { get; set; } // Changed to Guid to perfectly match Supabase's UUID type

        [Column("title")]
        public string Title { get; set; } = string.Empty;

        [Column("artist")]
        public string Artist { get; set; } = string.Empty;

        [Column("genre")]
        public string Genre { get; set; } = string.Empty;

        [Column("file_url")]
        public string FileUrl { get; set; } = string.Empty; // Named FileUrl to match what Next.js expects ("fileUrl")

        // 🛡️ Added '?' to make this nullable. If Supabase contains a NULL cell, it won't crash!
        [Column("duration_seconds")]
        public int? DurationSeconds { get; set; } = 0;

        // 🛡️ Added '?' to make this nullable.
        [Column("download_count")]
        public int? DownloadCount { get; set; } = 0;

        // 🛡️ Added '?' to make this nullable. Supabase timestamps often cause strict parsing failures if not handled this way.
        [Column("created_at")]
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    }
}