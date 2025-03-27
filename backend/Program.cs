using Persistence;
using backend.Services;
using Persistence.Helpers;

Console.WriteLine("Starting up...");

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Custom Services
builder.Services.CustomModelValidationServices();
builder.Services.CustomDbServices();

// Add Database Helpers
builder.Services.AddSingleton<IDatabaseHelpers, DatabaseHelpers>();

builder.Services.AddLogging(config =>
{
    config.AddConsole();
    config.AddDebug();
});

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
// make sure the database is created an up to date
try
{
    var dbHelpers = app.Services.GetRequiredService<IDatabaseHelpers>();
    var returnValue = dbHelpers.DatabaseStartUp();
    if (!returnValue.Success)
    {
        app.Logger.LogError("Database startup failed");
        foreach (var message in returnValue.Messages)
        {
            app.Logger.LogWarning(message);
        }
        foreach (var error in returnValue.Errors)
        {
            app.Logger.LogError(error);
        }
        Environment.Exit(1); // Exit the application if database startup fails
    }
}
catch (Exception ex)
{
    app.Logger.LogError(ex, "configuration setting does not include DefaultConnection.");
    Environment.Exit(1); // Exit the application if an exception occurs
}



app.UseHttpsRedirection();

app.UseRouting();

app.MapControllers();

app.Run();

Console.WriteLine("Press any key to exit...");
Console.ReadLine();