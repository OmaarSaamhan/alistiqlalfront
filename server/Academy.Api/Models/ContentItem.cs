using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace Academy.Api.Models;

public static class ContentTypes
{
    public static readonly HashSet<string> All = new(StringComparer.OrdinalIgnoreCase)
    {
        "partners", "activities", "programs", "projects", "players", "news", "settings"
    };
}

public sealed class ContentItem
{
    public int Id { get; set; }
    [MaxLength(32)] public required string Type { get; set; }
    [MaxLength(140)] public required string Slug { get; set; }
    [MaxLength(180)] public string Name { get; set; } = "";
    [MaxLength(180)] public string NameEn { get; set; } = "";
    [MaxLength(500)] public string LogoImage { get; set; } = "";
    [MaxLength(500)] public string CardImage { get; set; } = "";
    [MaxLength(220)] public string Title { get; set; } = "";
    [MaxLength(220)] public string TitleEn { get; set; } = "";
    [MaxLength(300)] public string Subtitle { get; set; } = "";
    [MaxLength(300)] public string SubtitleEn { get; set; } = "";
    public string Content { get; set; } = "";
    public string ContentEn { get; set; } = "";
    [MaxLength(40)] public string Date { get; set; } = "";
    [MaxLength(100)] public string Category { get; set; } = "";
    [MaxLength(100)] public string CategoryEn { get; set; } = "";
    [MaxLength(100)] public string Sport { get; set; } = "";
    [MaxLength(100)] public string SportEn { get; set; } = "";
    [MaxLength(100)] public string PlayingPeriod { get; set; } = "";
    [MaxLength(100)] public string PlayingPeriodEn { get; set; } = "";
    public string GalleryJson { get; set; } = "[]";
    public string HashtagsJson { get; set; } = "[]";
    public string HashtagsEnJson { get; set; } = "[]";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ContentDto ToDto() => new(Id, Type, Slug, Name, NameEn, LogoImage, CardImage, Title, TitleEn, Subtitle, SubtitleEn, Content, ContentEn, Date,
        Category, CategoryEn, Sport, SportEn, PlayingPeriod, PlayingPeriodEn, ReadList(GalleryJson), ReadList(HashtagsJson), ReadList(HashtagsEnJson), CreatedAt, UpdatedAt);

    public static List<string> ReadList(string json)
    {
        try { return JsonSerializer.Deserialize<List<string>>(json) ?? []; }
        catch (JsonException) { return []; }
    }
}

public sealed record ContentDto(int Id, string Type, string Slug, string Name, string NameEn, string LogoImage, string CardImage,
    string Title, string TitleEn, string Subtitle, string SubtitleEn, string Content, string ContentEn, string Date,
    string Category, string CategoryEn, string Sport, string SportEn, string PlayingPeriod, string PlayingPeriodEn,
    List<string> Gallery, List<string> Hashtags, List<string> HashtagsEn, DateTimeOffset CreatedAt, DateTimeOffset UpdatedAt);

public sealed record ContentInput(string? Type, string? Slug, string? Name, string? NameEn, string? LogoImage, string? CardImage,
    string? Title, string? TitleEn, string? Subtitle, string? SubtitleEn, string? Content, string? ContentEn,
    string? Date, string? Category, string? CategoryEn, string? Sport, string? SportEn,
    string? PlayingPeriod, string? PlayingPeriodEn, List<string>? Gallery, List<string>? Hashtags, List<string>? HashtagsEn);

public sealed record LoginInput(string? Password);

