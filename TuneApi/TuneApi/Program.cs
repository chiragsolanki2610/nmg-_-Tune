using Microsoft.EntityFrameworkCore;
using RegisterApi.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services
builder.Services.AddControllers();

// Database Connection
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. CORS Policy - Required for your Frontend to talk to this Backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// 3. Swagger Configuration (Moved OUTSIDE IsDevelopment for Render)
// This makes your live API show a UI instead of a 404 error
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "RegisterApi v1");
    c.RoutePrefix = string.Empty; // This makes Swagger the "Home Page"
});

// 4. Middleware Pipeline
app.UseCors("AllowAll");

// Note: UseHttpsRedirection can sometimes cause issues on Render's free tier. 
// If your app fails to load, you can comment this line out.
app.UseHttpsRedirection();

app.UseAuthorization();
app.MapControllers();

// 5. Database Auto-Creation (Runs on Startup)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // This will create the tables in Supabase if they don't exist
    db.Database.EnsureCreated();
    db.Database.ExecuteSqlRaw("""
        ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "Username" character varying(50);
        UPDATE "Users" SET "Username" = split_part("Email", '@', 1) WHERE "Username" IS NULL OR "Username" = '';
        ALTER TABLE "Users" ALTER COLUMN "Username" SET NOT NULL;
        ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "Bio" text;
        ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "ProfileImage" text;
        CREATE UNIQUE INDEX IF NOT EXISTS "IX_Users_Username" ON "Users" ("Username");
        """);
}

app.Run();
