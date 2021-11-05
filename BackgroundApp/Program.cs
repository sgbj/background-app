var builder = WebApplication.CreateBuilder(args);

builder.Host.UseWindowsService();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/filesystem/drives", () => Directory.GetLogicalDrives());

app.MapGet("/filesystem/entries", (string path) => Directory.EnumerateFileSystemEntries(path).Select(entry =>
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
}));

app.Run();
