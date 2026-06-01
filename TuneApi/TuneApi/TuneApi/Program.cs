using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.StaticFiles;
using Supabase;
using TuneApi.Data; // Matches the folder/namespace where your AppDbContext lives

var builder = WebApplication.CreateBuilder(args);

// ===================================================
// 1. KESTREL & FORM PARSER FILE LIMITS (100 MB)
// ===================================================
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 100_000_000; // Sets Kestrel limit to 100MB
});

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = 100_000_000; // Sets multipart form limit to 100MB
});

// ===================================================
// 2. CORE SERVICES & DATABASE REGISTRATION
// ===================================================
builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ===================================================
// 3. SUPABASE CLIENT REGISTRATION
// ===================================================
var supabaseUrl = builder.Configuration["Supabase:Url"]?.TrimEnd('/')
    ?? throw new InvalidOperationException("Supabase:Url is not configured.");
var supabaseKey = builder.Configuration["Supabase:Key"]
    ?? throw new InvalidOperationException("Supabase:Key is not configured.");

builder.Services.AddSingleton(provider =>
    new Supabase.Client(supabaseUrl, supabaseKey, new SupabaseOptions
    {
        AutoRefreshToken = true,
        AutoConnectRealtime = true
    }));

// ===================================================
// 4. SUPABASE JWT AUTHENTICATION
// ===================================================
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.MetadataAddress = $"{supabaseUrl}/auth/v1/.well-known/openid-configuration";
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidIssuer = $"{supabaseUrl}/auth/v1",
        ValidateAudience = true,
        ValidAudience = "authenticated",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// ===================================================
// 5. SWASHBUCKLE SWAGGER CONFIGURATION
// ===================================================
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TuneApi", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Paste your Supabase JWT access token here."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// ===================================================
// 6. CORS POLICY DEFINITION
// ===================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// ===================================================
// 7. MIDDLEWARE PIPELINE EXECUTION ORDER
// ===================================================

// A. Swagger UI (Always root page if in Development mode)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TuneApi v1");
        options.RoutePrefix = string.Empty;
    });
}

// B. Network Protocols and Routing
app.UseHttpsRedirection();
app.UseCors("AllowAll");

// C. Explicitly Serve Audio Tracks with HTTP Range Support
var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "uploads");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".wav"] = "audio/wav";

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads",
    ContentTypeProvider = provider,
    OnPrepareResponse = ctx =>
    {
        // Crucial for media elements: Lets the browser seamlessly request chunks (bytes) of audio files
        ctx.Context.Response.Headers.Append("Accept-Ranges", "bytes");
    }
});

// D. Security Middleware
app.UseAuthentication();
app.UseAuthorization();

// E. Map Controller Routes
app.MapControllers();

app.Run();