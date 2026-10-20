using Academy.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Academy.Api.Data;

public sealed class AcademyDbContext(DbContextOptions<AcademyDbContext> options) : DbContext(options)
{
    public DbSet<ContentItem> ContentItems => Set<ContentItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ContentItem>().HasIndex(item => new { item.Type, item.Slug }).IsUnique();
        modelBuilder.Entity<ContentItem>().Property(item => item.Type).IsRequired();
        modelBuilder.Entity<ContentItem>().Property(item => item.Slug).IsRequired();
    }
}
