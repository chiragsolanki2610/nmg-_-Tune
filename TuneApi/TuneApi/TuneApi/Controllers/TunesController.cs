using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TuneApi.Data;
using TuneApi.Models;

namespace TuneApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TunesController : ControllerBase
    {
        private readonly Supabase.Client _supabaseClient;
        private readonly AppDbContext _context;

        // 🔒 The designated administrator email
        private const string AdminEmail = "csolanki2610@gmail.com";

        // 🌐 Supabase Public CDN URL Base
        private const string SupabaseBaseUrl = "https://oryqeyborroqypklzbrw.supabase.co";
        private const string BucketName = "tunes";

        public TunesController(Supabase.Client supabaseClient, AppDbContext context)
        {
            _supabaseClient = supabaseClient;
            _context = context;
        }

        public class TuneUploadRequest
        {
            public IFormFile File { get; set; } = null!;
            public string Title { get; set; } = string.Empty;
            public string Artist { get; set; } = string.Empty;
            public string Genre { get; set; } = string.Empty;
        }

        /// <summary>
        /// Helper to dynamically build the absolute public streaming CDN URL for a file
        /// </summary>
        private string BuildPublicUrl(string? fileName)
        {
            if (string.IsNullOrEmpty(fileName)) return "";

            // Encode spaces and characters accurately as %20 instead of + for web standards compatibility
            string urlSafeFileName = Uri.EscapeDataString(fileName);
            return $"{SupabaseBaseUrl.TrimEnd('/')}/storage/v1/object/public/{BucketName}/{urlSafeFileName}";
        }

        /// <summary>
        /// 🔓 GET TRENDING: Publicly accessible. 
        /// Fetches the top 6 tracks ordered by popularity (DownloadCount descending).
        /// </summary>
        [AllowAnonymous]
        [HttpGet("trending")]
        public async Task<IActionResult> GetTrendingTunes()
        {
            try
            {
                var trendingTracks = await _context.Tunes
                    .OrderByDescending(t => t.DownloadCount ?? 0)
                    .Take(6)
                    .ToListAsync();

                var cleanList = trendingTracks.Select(t => new {
                    id = t.Id,
                    title = t.Title ?? "Unknown Title",
                    artist = t.Artist ?? "Unknown Artist",
                    genre = t.Genre ?? "Unassigned",
                    // 💡 FIX: Appends full Supabase link instead of a raw local filename string
                    fileUrl = BuildPublicUrl(t.FileUrl),
                    durationSeconds = t.DurationSeconds ?? 0,
                    downloadCount = t.DownloadCount ?? 0,
                    createdAt = t.CreatedAt ?? DateTime.UtcNow
                });

                return Ok(cleanList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[C# Backend Error] Failed to fetch trending tracks: {ex.Message}");
                return StatusCode(500, new { error = $"Error pulling trending tunes: {ex.Message}" });
            }
        }

        /// <summary>
        /// 🔓 GET ALL: Publicly accessible. Safely formats track primitives with defaults if they are null.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTunes()
        {
            try
            {
                var tracks = await _context.Tunes.ToListAsync();

                var cleanList = tracks.Select(t => new {
                    id = t.Id,
                    title = t.Title ?? "Unknown Title",
                    artist = t.Artist ?? "Unknown Artist",
                    genre = t.Genre ?? "Unassigned",
                    // 💡 FIX: Appends full Supabase link instead of a raw local filename string
                    fileUrl = BuildPublicUrl(t.FileUrl),
                    durationSeconds = t.DurationSeconds ?? 0,
                    downloadCount = t.DownloadCount ?? 0,
                    createdAt = t.CreatedAt ?? DateTime.UtcNow
                });

                return Ok(cleanList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error pulling tunes catalog: {ex.Message}");
            }
        }

        /// <summary>
        /// 🔓 GET BY GENRE: Publicly accessible. Filters tracks based on the category string.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("genre/{genreName}")]
        public async Task<IActionResult> GetTunesByGenre(string genreName)
        {
            if (string.IsNullOrEmpty(genreName))
                return BadRequest(new { error = "Genre parameter is required." });

            try
            {
                var tracks = await _context.Tunes
                    .Where(t => t.Genre != null && t.Genre.ToLower() == genreName.ToLower())
                    .ToListAsync();

                var cleanList = tracks.Select(t => new {
                    id = t.Id,
                    title = t.Title ?? "Unknown Title",
                    artist = t.Artist ?? "Unknown Artist",
                    genre = t.Genre ?? genreName,
                    // 💡 FIX: Appends full Supabase link instead of a raw local filename string
                    fileUrl = BuildPublicUrl(t.FileUrl),
                    durationSeconds = t.DurationSeconds ?? 0,
                    downloadCount = t.DownloadCount ?? 0,
                    createdAt = t.CreatedAt ?? DateTime.UtcNow
                });

                return Ok(cleanList);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[C# Backend Error] Failed to fetch genre tracks: {ex.Message}");
                return StatusCode(500, new { error = $"Error pulling genre filtered tunes: {ex.Message}" });
            }
        }

        /// <summary>
        /// 🔓 STREAM/DOWNLOAD LINK: Publicly accessible.
        /// ✅ Uses Uri.EscapeDataString so spaces become %20 (not +) which Supabase accepts.
        /// </summary>
        [AllowAnonymous]
        [HttpGet("download")]
        public async Task<IActionResult> GetSecureDownloadLink([FromQuery] string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return BadRequest(new { error = "Filename parameter query is required." });

            string sanitizedFileName = WebUtility.UrlDecode(fileName);

            try
            {
                int linkExpirySeconds = 3600; // 1 hour

                string expiringSignedUrl = await _supabaseClient.Storage
                    .From(BucketName)
                    .CreateSignedUrl(sanitizedFileName, linkExpirySeconds);

                if (!string.IsNullOrEmpty(expiringSignedUrl) && !expiringSignedUrl.Contains("error"))
                {
                    return Ok(new { downloadUrl = expiringSignedUrl });
                }

                throw new Exception("SDK client returned an empty or invalid signed URL.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Supabase Signed URL Failed]: {ex.Message}. Activating public CDN fallback.");

                try
                {
                    string directPublicUrl = BuildPublicUrl(sanitizedFileName);
                    return Ok(new { downloadUrl = directPublicUrl });
                }
                catch (Exception fallbackEx)
                {
                    return StatusCode(500, new { error = $"Critical failure building fallback URL: {fallbackEx.Message}" });
                }
            }
        }

        /// <summary>
        /// 🔒 UPLOAD: Strict Admin Only.
        /// Sanitizes filename on upload — removes spaces, dots, and special characters
        /// so Supabase storage URLs are always clean and playable.
        /// </summary>
        [Authorize]
        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadTune([FromForm] TuneUploadRequest request)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(userEmail) || !userEmail.Equals(AdminEmail, StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(403, "Access Denied: Only the system administrator is authorized to upload music.");
            }

            if (request.File == null || request.File.Length == 0)
                return BadRequest("An audio file is required.");

            try
            {
                using var ms = new MemoryStream();
                await request.File.CopyToAsync(ms);
                var fileBytes = ms.ToArray();

                var originalName = Path.GetFileNameWithoutExtension(request.File.FileName);
                var extension = Path.GetExtension(request.File.FileName).ToLowerInvariant();
                var cleanName = Regex.Replace(originalName, @"[^a-zA-Z0-9_\-]", "_");
                var uniqueFileName = $"{Guid.NewGuid()}_{cleanName}{extension}";

                // Upload to Supabase storage bucket
                await _supabaseClient.Storage
                    .From(BucketName)
                    .Upload(fileBytes, uniqueFileName, new Supabase.Storage.FileOptions { ContentType = request.File.ContentType });

                // Save record to database
                var newTune = new Tune
                {
                    Id = Guid.NewGuid(),
                    Title = request.Title,
                    Artist = request.Artist,
                    Genre = request.Genre,
                    FileUrl = uniqueFileName, // We still keep just the unique file identifier in the DB row
                    DurationSeconds = 0,
                    DownloadCount = 0,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Tunes.Add(newTune);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Track successfully uploaded!", id = newTune.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error during upload: {ex.Message}");
            }
        }

        /// <summary>
        /// 🔒 DELETE: Strict Admin Only.
        /// </summary>
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTune(Guid id)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.Email);

            if (string.IsNullOrEmpty(userEmail) || !userEmail.Equals(AdminEmail, StringComparison.OrdinalIgnoreCase))
            {
                return StatusCode(403, "Access Denied: Only the system administrator is authorized to delete music.");
            }

            try
            {
                var targetTune = await _context.Tunes.FindAsync(id);

                if (targetTune == null)
                    return NotFound("The requested track could not be found.");

                // Remove file from storage
                if (!string.IsNullOrEmpty(targetTune.FileUrl))
                {
                    await _supabaseClient.Storage
                        .From(BucketName)
                        .Remove(new List<string> { targetTune.FileUrl });
                }

                // Remove record from database
                _context.Tunes.Remove(targetTune);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Track '{targetTune.Title}' was successfully deleted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error during deletion: {ex.Message}");
            }
        }
    }
}