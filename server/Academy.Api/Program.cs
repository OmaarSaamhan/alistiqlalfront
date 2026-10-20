using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Academy.Api.Data;
using Academy.Api.Models;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "wwwroot",
});
var allowedOrigin = builder.Configuration["WEB_ORIGIN"] ?? "http://localhost:3000";
var webRootDirectory = builder.Environment.WebRootPath!;
Directory.CreateDirectory(Path.Combine(webRootDirectory, "uploads"));
var appDataDirectory = Path.Combine(builder.Environment.ContentRootPath, "App_Data");
Directory.CreateDirectory(Path.Combine(appDataDirectory, "keys"));
var defaultDatabase = Path.Combine(appDataDirectory, "academy.db");
var connectionString = builder.Configuration.GetConnectionString("Academy") ?? $"Data Source={defaultDatabase}";

builder.Services.AddDbContext<AcademyDbContext>(options => options.UseSqlite(connectionString));
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(appDataDirectory, "keys")))
    .SetApplicationName("Al-Istiqlal-Academy-Admin");
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .WithOrigins(allowedOrigin).AllowAnyHeader().AllowAnyMethod().AllowCredentials()));
builder.Services.AddRateLimiter(options => options.AddFixedWindowLimiter("admin-login", limiter =>
{
    limiter.PermitLimit = 5;
    limiter.Window = TimeSpan.FromMinutes(1);
    limiter.QueueLimit = 0;
}));
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "academy_admin";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = builder.Environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();
Directory.CreateDirectory(appDataDirectory);
app.UseRouting();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AcademyDbContext>();
    await db.Database.EnsureCreatedAsync();
    await EnsureBilingualColumnsAsync(db);
}

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", service = "Al-Istiqlal Academy API", version = "10" }));

app.MapPost("/api/admin/session", async (LoginInput input, HttpContext context, IConfiguration config) =>
{
    var expectedPassword = config["ADMIN_PASSWORD"];
    if (string.IsNullOrEmpty(expectedPassword))
        return Results.Problem("Set ADMIN_PASSWORD before using the admin dashboard.", statusCode: 503);

    var expectedHash = SHA256.HashData(Encoding.UTF8.GetBytes(expectedPassword));
    var suppliedHash = SHA256.HashData(Encoding.UTF8.GetBytes(input.Password ?? ""));
    if (!CryptographicOperations.FixedTimeEquals(expectedHash, suppliedHash))
        return Results.Unauthorized();

    var identity = new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "academy-admin"), new Claim(ClaimTypes.Name, "Administrator")], CookieAuthenticationDefaults.AuthenticationScheme);
    await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    return Results.Ok(new { authenticated = true });
}).RequireRateLimiting("admin-login");

app.MapDelete("/api/admin/session", async (HttpContext context) =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.NoContent();
}).RequireAuthorization();

app.MapGet("/api/admin/session", () => Results.Ok(new { authenticated = true })).RequireAuthorization();

app.MapGet("/api/content/{type}", async (string type, AcademyDbContext db) =>
{
    if (!ContentTypes.All.Contains(type)) return Results.NotFound();
    var items = await db.ContentItems.AsNoTracking().Where(item => item.Type == type).ToListAsync();
    items = items.OrderByDescending(item => item.Date).ThenByDescending(item => item.CreatedAt).ToList();
    var records = items.Select(item => item.ToDto()).ToList();
    return Results.Ok(records);
});

app.MapGet("/api/content/{type}/{slug}", async (string type, string slug, AcademyDbContext db) =>
{
    if (!ContentTypes.All.Contains(type)) return Results.NotFound();
    var item = await db.ContentItems.AsNoTracking().FirstOrDefaultAsync(record => record.Type == type && record.Slug == slug);
    return item is null ? Results.NotFound() : Results.Ok(item.ToDto());
});

app.MapGet("/api/admin/content", async (string? type, AcademyDbContext db) =>
{
    var query = db.ContentItems.AsNoTracking().AsQueryable();
    if (!string.IsNullOrWhiteSpace(type))
    {
        if (!ContentTypes.All.Contains(type)) return Results.BadRequest(new { message = "نوع المحتوى غير صالح." });
        query = query.Where(item => item.Type == type);
    }
    var items = await query.ToListAsync();
    items = items.OrderByDescending(item => item.UpdatedAt).ToList();
    var records = items.Select(item => item.ToDto()).ToList();
    return Results.Ok(records);
}).RequireAuthorization();

app.MapPost("/api/admin/content", async (ContentInput input, AcademyDbContext db) =>
{
    var errors = Validate(input);
    if (errors.Count > 0) return Results.ValidationProblem(errors);
    var slug = input.Slug!.Trim();
    var type = input.Type!.Trim().ToLowerInvariant();
    if (await db.ContentItems.AnyAsync(item => item.Type == type && item.Slug == slug))
        return Results.Conflict(new { message = "يوجد محتوى بهذا الرابط بالفعل." });
    var item = ApplyInput(new ContentItem { Type = type, Slug = slug }, input);
    db.ContentItems.Add(item);
    await db.SaveChangesAsync();
    return Results.Created($"/api/content/{item.Type}/{item.Slug}", item.ToDto());
}).RequireAuthorization();

app.MapPut("/api/admin/content/{id:int}", async (int id, ContentInput input, AcademyDbContext db) =>
{
    var item = await db.ContentItems.FindAsync(id);
    if (item is null) return Results.NotFound();
    var errors = Validate(input);
    if (errors.Count > 0) return Results.ValidationProblem(errors);
    var slug = input.Slug!.Trim();
    var type = input.Type!.Trim().ToLowerInvariant();
    if (await db.ContentItems.AnyAsync(other => other.Id != id && other.Type == type && other.Slug == slug))
        return Results.Conflict(new { message = "يوجد محتوى بهذا الرابط بالفعل." });
    ApplyInput(item, input);
    item.UpdatedAt = DateTimeOffset.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(item.ToDto());
}).RequireAuthorization();

app.MapDelete("/api/admin/content/{id:int}", async (int id, AcademyDbContext db) =>
{
    var item = await db.ContentItems.FindAsync(id);
    if (item is null) return Results.NotFound();
    db.ContentItems.Remove(item);
    await db.SaveChangesAsync();
    return Results.NoContent();
}).RequireAuthorization();

app.MapPost("/api/admin/uploads", async (HttpRequest request, string name, IWebHostEnvironment environment) =>
{
    var extension = Path.GetExtension(name).ToLowerInvariant();
    var supported = new HashSet<string>([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
    if (!supported.Contains(extension)) return Results.BadRequest(new { message = "الامتدادات المسموحة: JPG, PNG, WEBP, GIF." });
    if (request.ContentType is null || !request.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        return Results.BadRequest(new { message = "الملف المرفوع يجب أن يكون صورة." });
    if (request.ContentLength is > 10_485_760) return Results.BadRequest(new { message = "الحد الأقصى لحجم الصورة 10 ميغابايت." });

    var folder = Path.Combine(environment.WebRootPath!, "uploads");
    Directory.CreateDirectory(folder);
    var safeName = $"{Guid.NewGuid():N}{extension}";
    var path = Path.Combine(folder, safeName);
    long totalBytes = 0;
    var buffer = new byte[64 * 1024];
    await using (var output = File.Create(path))
    {
        int bytesRead;
        while ((bytesRead = await request.Body.ReadAsync(buffer)) > 0)
        {
            totalBytes += bytesRead;
            if (totalBytes > 10_485_760)
            {
                await output.DisposeAsync();
                File.Delete(path);
                return Results.BadRequest(new { message = "الملف أكبر من 10 ميغابايت." });
            }
            await output.WriteAsync(buffer.AsMemory(0, bytesRead));
        }
    }
    if (totalBytes == 0) { File.Delete(path); return Results.BadRequest(new { message = "الملف فارغ." }); }
    return Results.Ok(new { url = $"/uploads/{safeName}" });
}).RequireAuthorization();

app.Run();

static Dictionary<string, string[]> Validate(ContentInput input)
{
    var errors = new Dictionary<string, string[]>();
    static void Need(Dictionary<string, string[]> errors, string field, string? value, string message)
    {
        if (string.IsNullOrWhiteSpace(value)) errors[field] = [message];
    }
    static void NeedBoth(Dictionary<string, string[]> errors, string field, string? arabic, string? english, string message, bool required = true)
    {
        var hasArabic = !string.IsNullOrWhiteSpace(arabic);
        var hasEnglish = !string.IsNullOrWhiteSpace(english);
        if (required || hasArabic || hasEnglish)
        {
            if (!hasArabic) errors[field] = [message + " (بالعربية)."];
            if (!hasEnglish) errors[field + "En"] = [message + " (بالإنجليزية)."];
        }
    }

    if (input.Type is null || !ContentTypes.All.Contains(input.Type)) errors["type"] = ["نوع المحتوى غير معروف."];
    Need(errors, "slug", input.Slug, "أدخل رابطًا مختصرًا للمحتوى.");
    if (input.Slug?.Length > 140) errors["slug"] = ["الرابط المختصر طويل جدًا."];

    switch ((input.Type ?? "").ToLowerInvariant())
    {
        case "partners":
            NeedBoth(errors, "name", input.Name, input.NameEn, "أدخل اسم المؤسسة");
            Need(errors, "logoImage", input.LogoImage, "ارفع شعار المؤسسة.");
            NeedBoth(errors, "title", input.Title, input.TitleEn, "أدخل العنوان الرئيسي");
            NeedBoth(errors, "subtitle", input.Subtitle, input.SubtitleEn, "أدخل العنوان الفرعي", false);
            NeedBoth(errors, "content", input.Content, input.ContentEn, "أدخل تفاصيل التعاون");
            break;
        case "activities":
        case "programs":
        case "projects":
            Need(errors, "cardImage", input.CardImage, "ارفع صورة البطاقة.");
            NeedBoth(errors, "title", input.Title, input.TitleEn, "أدخل العنوان الرئيسي");
            NeedBoth(errors, "subtitle", input.Subtitle, input.SubtitleEn, "أدخل العنوان الفرعي", false);
            NeedBoth(errors, "content", input.Content, input.ContentEn, "أدخل التفاصيل", false);
            NeedBoth(errors, "category", input.Category, input.CategoryEn, "أدخل التصنيف", false);
            Need(errors, "date", input.Date, "أدخل التاريخ.");
            break;
        case "players":
            Need(errors, "cardImage", input.CardImage, "ارفع صورة اللاعب.");
            NeedBoth(errors, "name", input.Name, input.NameEn, "أدخل اسم اللاعب");
            NeedBoth(errors, "sport", input.Sport, input.SportEn, "أدخل اسم الرياضة");
            NeedBoth(errors, "playingPeriod", input.PlayingPeriod, input.PlayingPeriodEn, "أدخل فترة اللعب");
            break;
        case "news":
            Need(errors, "cardImage", input.CardImage, "ارفع صورة الخبر.");
            NeedBoth(errors, "title", input.Title, input.TitleEn, "أدخل العنوان الرئيسي");
            NeedBoth(errors, "subtitle", input.Subtitle, input.SubtitleEn, "أدخل العنوان الفرعي", false);
            NeedBoth(errors, "category", input.Category, input.CategoryEn, "أدخل التصنيف", false);
            NeedBoth(errors, "content", input.Content, input.ContentEn, "أدخل محتوى الخبر");
            break;
        case "settings":
            if (!string.Equals(input.Slug, "social-links", StringComparison.Ordinal))
                errors["slug"] = ["معرّف إعداد الروابط غير صالح."];
            try
            {
                using var document = JsonDocument.Parse(input.Content ?? "");
                if (document.RootElement.ValueKind != JsonValueKind.Object)
                    errors["content"] = ["بيانات روابط التواصل غير صالحة."];
            }
            catch (JsonException)
            {
                errors["content"] = ["أدخل روابط التواصل بصيغة صحيحة."];
            }
            break;
    }
    return errors;
}

static ContentItem ApplyInput(ContentItem item, ContentInput input)
{
    item.Type = (input.Type ?? "").Trim().ToLowerInvariant();
    item.Slug = (input.Slug ?? "").Trim();
    item.Name = input.Name?.Trim() ?? "";
    item.NameEn = input.NameEn?.Trim() ?? "";
    item.LogoImage = input.LogoImage?.Trim() ?? "";
    item.CardImage = input.CardImage?.Trim() ?? "";
    item.Title = input.Title?.Trim() ?? "";
    item.TitleEn = input.TitleEn?.Trim() ?? "";
    item.Subtitle = input.Subtitle?.Trim() ?? "";
    item.SubtitleEn = input.SubtitleEn?.Trim() ?? "";
    item.Content = input.Content?.Trim() ?? "";
    item.ContentEn = input.ContentEn?.Trim() ?? "";
    item.Date = input.Date?.Trim() ?? "";
    item.Category = input.Category?.Trim() ?? "";
    item.CategoryEn = input.CategoryEn?.Trim() ?? "";
    item.Sport = input.Sport?.Trim() ?? "";
    item.SportEn = input.SportEn?.Trim() ?? "";
    item.PlayingPeriod = input.PlayingPeriod?.Trim() ?? "";
    item.PlayingPeriodEn = input.PlayingPeriodEn?.Trim() ?? "";
    item.GalleryJson = System.Text.Json.JsonSerializer.Serialize(input.Gallery ?? []);
    item.HashtagsJson = System.Text.Json.JsonSerializer.Serialize(input.Hashtags ?? []);
    item.HashtagsEnJson = System.Text.Json.JsonSerializer.Serialize(input.HashtagsEn ?? []);
    return item;
}

static async Task EnsureBilingualColumnsAsync(AcademyDbContext db)
{
    var connection = db.Database.GetDbConnection();
    await connection.OpenAsync();
    var existing = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
    await using (var command = connection.CreateCommand())
    {
        command.CommandText = "PRAGMA table_info('ContentItems');";
        await using var reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync()) existing.Add(reader.GetString(1));
    }

    var columns = new[] { "NameEn", "TitleEn", "SubtitleEn", "ContentEn", "CategoryEn", "SportEn", "PlayingPeriodEn", "HashtagsEnJson" };
    foreach (var column in columns.Where(column => !existing.Contains(column)))
    {
        await using var command = connection.CreateCommand();
        command.CommandText = $"ALTER TABLE \"ContentItems\" ADD COLUMN \"{column}\" TEXT NOT NULL DEFAULT '';";
        await command.ExecuteNonQueryAsync();
    }
    await connection.CloseAsync();
}
