The project only runs locally.

To Configure project follow this steps: 

1. enter the "frontend" directory and run: "npm install", after it's complete, run "npm run" - that will open the client in "localhost:3000"
2. enter the "backend"directory and run: "dotnet build" and than "dotnet run" = that will start the server
3. there is a file called script.sql, this is the scripts of all tables and procedures, run in your database. 
4. adjust your database:  enter the "backend"directory - check the "DefaultConnection" in "DefaultConnection" inside of "appsettings.json" fits you database

example:

"ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=master;Trusted_Connection=True;Encrypt=false;TrustServerCertificate=true"
  } 