using System.Diagnostics;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient("github", client =>
{
    client.DefaultRequestHeaders.UserAgent.Add(new("background-app", builder.Configuration["Version"]));
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/version", async (IConfiguration configuration, IHttpClientFactory factory) =>
{
    using var client = factory.CreateClient("github");
    var json = await client.GetStringAsync($"https://api.github.com/repos/{configuration["Repository"]}/releases/latest");
    var document = JsonDocument.Parse(json);
    var tag = document.RootElement.GetProperty("tag_name").GetString();
    return new
    {
        Repository = configuration["Repository"],
        Version = configuration["Version"],
        Latest = tag
    };
});

app.MapPost("/update", (IWebHostEnvironment env) =>
{
    var info = new ProcessStartInfo("powershell") { UseShellExecute = true };
    info.ArgumentList.Add("-File");
    info.ArgumentList.Add(Path.Combine(env.ContentRootPath, "update.ps1"));
    Process.Start(info);
});

app.MapGet("/filesystem", (string? path) => 
{
    if (string.IsNullOrWhiteSpace(path))
    {
        return Directory.GetLogicalDrives().Select(drive => new
        {
            Name = drive,
            Path = drive,
            Type = "Drive"
        });
    }

    return Directory.EnumerateFileSystemEntries(path).Select(entry =>
    {
        FileSystemInfo info = File.Exists(entry) ? new FileInfo(entry) : new DirectoryInfo(entry);
        return new
        {
            info.Name,
            Path = info.FullName,
            Type = info switch
            {
                FileInfo => "File",
                DirectoryInfo => "Directory",
                _ => null
            }
        };
    });
});

app.Run();
