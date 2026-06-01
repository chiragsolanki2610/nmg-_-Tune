using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RegisterApi.Data;
using RegisterApi.Models;

namespace RegisterApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AppDbContext db, ILogger<AuthController> logger)
    {
        _db = db;
        _logger = logger;
    }

    // --- REGISTER ENDPOINT ---
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // 1. Check if user already exists
            if (await _db.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
            {
                return BadRequest(new { success = false, message = "User with this email already exists." });
            }

            if (await _db.Users.AnyAsync(u => u.Username.ToLower() == request.Username.ToLower()))
            {
                return BadRequest(new { success = false, message = "Username is already taken." });
            }

            // 2. Hash the password using BCrypt
            // This turns "mypassword123" into a secure, unreadable string
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // 3. Create the User object based on your User.cs model
            var newUser = new User
            {
                Username = request.Username,
                Name = request.Name,
                Email = request.Email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };

            // 4. Save to Supabase
            _db.Users.Add(newUser);
            await _db.SaveChangesAsync();

            return Ok(new { success = true, message = "Registration successful!" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for {Email}", request.Email);
            return StatusCode(500, new { success = false, message = "An error occurred during registration." });
        }
    }

    // --- LOGIN ENDPOINT ---
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user == null)
            {
                return Unauthorized(new { success = false, message = "Invalid email or password." });
            }

            // Verify the entered password against the stored BCrypt hash
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                return Unauthorized(new { success = false, message = "Invalid email or password." });
            }

            return Ok(new
            {
                success = true,
                message = "Login successful.",
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    name = user.Name,
                    email = user.Email,
                    bio = user.Bio,
                    profileImage = user.ProfileImage
                },
                token = "dummy-jwt-token"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for {Email}", request.Email);
            return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
        }
    }

    // --- PROFILE UPDATE ENDPOINT ---
    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower());

            if (user == null)
            {
                return NotFound(new { success = false, message = "User not found." });
            }

            user.Bio = request.Bio;
            user.ProfileImage = request.ProfileImage;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Profile updated successfully.",
                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    name = user.Name,
                    email = user.Email,
                    bio = user.Bio,
                    profileImage = user.ProfileImage
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile for {Email}", request.Email);
            return StatusCode(500, new { success = false, message = "An unexpected error occurred." });
        }
    }
}
