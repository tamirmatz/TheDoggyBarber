using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

public enum AuthenticationResult
{
    Success = 0,
    UserNotFound = 1,
    IncorrectPassword = 2,
    SqlError = 3,
    GeneralError = 4
}

public enum SignUpResult
{
    Success = 0,
    UsernameAlreadyExists = 1,
    GeneralError = 2
}

public class User
{
    public int UserId { get; set; } 
    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; } 

    [Required]
    public string FirstName { get; set; }
}

public class SignInRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}

public class AuthenticationResponse
{
    public AuthenticationResult Status { get; set; }
    public User User { get; set; }
}
