using DogBarber.Data;  
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Set application URLs
builder.WebHost.UseUrls("http://localhost:5029", "https://localhost:7184");

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
            builder => builder.WithOrigins("http://localhost:3000")
                              .AllowAnyMethod()
                              .AllowAnyHeader()
                              .AllowCredentials());

});

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add support for controllers
builder.Services.AddControllers();  // This line enables traditional controllers

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

// Use routing (generally not necessary to explicitly define in minimal APIs but required if using controllers)
app.UseRouting();

// Use CORS policy
app.UseCors("AllowSpecificOrigin");


// Map conventional controllers
app.MapControllers();  // This line is crucial for enabling routing to controllers


app.Run();
