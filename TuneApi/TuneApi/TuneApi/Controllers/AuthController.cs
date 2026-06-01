using Microsoft.AspNetCore.Mvc;
using Supabase;
using System.Collections.Generic;
using System.Threading.Tasks;
using RegisterApi.Models; // 🛠️ This links to your original model files without changing them!

namespace TuneApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly Supabase.Client _supabaseClient;

        public AuthController(Supabase.Client supabaseClient)
        {
            _supabaseClient = supabaseClient;
        }

        // --- REGISTER ENDPOINT ---
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var signUpOptions = new Supabase.Gotrue.SignUpOptions
                {
                    Data = new Dictionary<string, object> { { "display_name", request.Name } }
                };

                var session = await _supabaseClient.Auth.SignUp(request.Email, request.Password, signUpOptions);

                if (session == null)
                    return BadRequest(new { message = "Registration failed." });

                return Ok(new { success = true, message = "User registered successfully! Check email if validation is on." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // --- LOGIN ENDPOINT ---
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var session = await _supabaseClient.Auth.SignIn(request.Email, request.Password);

                if (session?.AccessToken == null)
                    return Unauthorized(new { message = "Invalid email or password." });

                return Ok(new
                {
                    success = true,
                    message = "Login successful.",
                    name = session.User?.UserMetadata?.ContainsKey("display_name") == true ? session.User.UserMetadata["display_name"].ToString() : "User",
                    email = session.User?.Email,
                    token = session.AccessToken
                });
            }
            catch (System.Exception ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
        }
    }
}