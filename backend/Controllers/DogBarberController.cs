using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient; // Updated namespace
using System.Data; // For CommandType, ParameterDirection, etc.

namespace DogBarber
{
    [ApiController]
    [Route("[controller]")]
    public class DogBarberController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<DogBarberController> _logger;

        public DogBarberController(IConfiguration configuration, ILogger<DogBarberController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("SignUp")]
        public IActionResult SignUp([FromBody] User user)
        {
            _logger.LogInformation("Attempting to register a new user: {Username}", user.Username);

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Sign Up attempt failed due to invalid model state for user: {Username}", user.Username);
                return BadRequest(ModelState);
            }

            // Hash the password
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    using (var command = new SqlCommand("spAddUser", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddWithValue("@Username", user.Username);
                        command.Parameters.AddWithValue("@Password", user.Password);
                        command.Parameters.AddWithValue("@FirstName", user.FirstName);

                        var resultParam = new SqlParameter("@Result", SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        };
                        command.Parameters.Add(resultParam);

                        command.ExecuteNonQuery();

                        int result = (int)resultParam.Value;
                        if (result == (int)SignUpResult.Success)
                        {
                            _logger.LogInformation("User successfully registered: {Username}", user.Username);
                            return Ok(SignUpResult.Success);
                        }
                        else if (result == (int)SignUpResult.UsernameAlreadyExists)
                        {
                            _logger.LogWarning("Sign Up attempt failed because the username already exists: {Username}", user.Username);
                            return Ok(SignUpResult.UsernameAlreadyExists);
                        }
                        else
                        {
                            _logger.LogError("An unexpected result code was returned from the sign-up procedure for user: {Username}", user.Username);
                            return Ok(SignUpResult.GeneralError);
                        }
                    }
                }
            } 
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to register user: {Username}", user.Username);
                return Ok(SignUpResult.GeneralError); // General error
            }
        }


        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            if (request == null)
            {
                _logger.LogWarning("SignIn request is null.");
                return Ok(new AuthenticationResponse { Status = AuthenticationResult.GeneralError });
            }

            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    
                    var command = new SqlCommand("spAuthenticateUser", connection)
                    {
                        CommandType = CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@Username", request.Username);

                    var userIdParam = new SqlParameter("@UserId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    var firstNameParam = new SqlParameter("@FirstName", SqlDbType.NVarChar, 255)
                    {
                        Direction = ParameterDirection.Output
                    };
                    var storedHashParam = new SqlParameter("@StoredHash", SqlDbType.NVarChar, 255)
                    {
                        Direction = ParameterDirection.Output
                    };

                    command.Parameters.Add(userIdParam);
                    command.Parameters.Add(firstNameParam);
                    command.Parameters.Add(storedHashParam);

                    await command.ExecuteNonQueryAsync();

                    var storedHash = storedHashParam.Value as string;
                    if (string.IsNullOrEmpty(storedHash))
                    {
                        _logger.LogInformation("No user found with username: {Username}", request.Username);
                        return Ok(new AuthenticationResponse { Status = AuthenticationResult.UserNotFound });
                    }

                    bool isVerified = BCrypt.Net.BCrypt.Verify(request.Password, storedHash);
                    if (!isVerified)
                    {
                        _logger.LogInformation("Incorrect password attempt for username: {Username}", request.Username);
                        return Ok(new AuthenticationResponse { Status = AuthenticationResult.IncorrectPassword });
                    }

                    var returnedUser = new User
                    {
                        UserId = (int)userIdParam.Value,
                        FirstName = firstNameParam.Value as string,
                        Username = request.Username
                    };

                    _logger.LogInformation("User authenticated successfully: {Username}", request.Username);
                    return Ok(new AuthenticationResponse { Status = AuthenticationResult.Success, User = returnedUser });
                }
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError(sqlEx, "SQL error occurred while authenticating user: {Username}", request.Username);
                return Ok(new AuthenticationResponse { Status = AuthenticationResult.SqlError });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to authenticate user: {Username}", request.Username);
                return Ok(new AuthenticationResponse { Status = AuthenticationResult.GeneralError });
            }
        }

        [HttpGet("GetAppointments")]
        public async Task<IActionResult> GetAllAppointmentsAsync()
        {
            var appointments = new List<Appointment>();

            try
            {
                string connectionString = _configuration.GetConnectionString("DefaultConnection");
                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    var command = new SqlCommand("SELECT AppointmentId, UserId, FirstName, AppointmentTime, CreationTime FROM Appointments ORDER BY AppointmentTime ASC", connection);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            appointments.Add(new Appointment
                            {
                                AppointmentId = reader.GetInt32(0),
                                UserId = reader.GetInt32(1),
                                FirstName = reader.GetString(2),
                                AppointmentTime = reader.GetDateTime(3),
                                CreationTime = reader.GetDateTime(4)
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "error while fetching appointments");
                return Ok(new GetAppointmentsResponse { Status = GeneralResponseStatusCode.Failure});
            }

            return Ok(new GetAppointmentsResponse { Status = GeneralResponseStatusCode.Success, Appointments = appointments });
        }

        [HttpPut("UpdateAppointment")]
        public async Task<IActionResult> UpdateAppointment([FromBody] UpdateAppointmentRequest request)
        {
            try
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    string sql = "UPDATE Appointments SET AppointmentTime = @AppointmentTime WHERE AppointmentId = @AppointmentId";

                    using (var command = new SqlCommand(sql, connection))
                    {
                        command.Parameters.AddWithValue("@AppointmentId", request.AppointmentId);
                        command.Parameters.AddWithValue("@AppointmentTime", request.AppointmentTime);

                        await connection.OpenAsync();
                        int affectedRows = await command.ExecuteNonQueryAsync();

                        if (affectedRows > 0)
                        {
                            return Ok(GeneralResponseStatusCode.Success);
                        }
                        else
                        {
                            return Ok(GeneralResponseStatusCode.Failure);
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                _logger.LogError(ex, "sql error while deleting appointment");
                return Ok(GeneralResponseStatusCode.Failure);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "error while deleting appointment");
                return Ok(GeneralResponseStatusCode.Failure);
            }
        }


        [HttpPost("AddAppointment")]
        public IActionResult AddAppointment([FromBody] AddAppointmentRequest request)
        {
            try
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    connection.Open();
                    var command = new SqlCommand("spAddAppointment", connection)
                    {
                        CommandType = System.Data.CommandType.StoredProcedure
                    };
                    command.Parameters.AddWithValue("@UserId", request.UserId);
                    command.Parameters.AddWithValue("@FirstName", request.FirstName);
                    command.Parameters.AddWithValue("@AppointmentTime", request.AppointmentTime);

                    var result = command.ExecuteScalar();
            
                    if (result != null && result != DBNull.Value)
                    {
                        // Convert decimal to int explicitly if the return type is decimal
                        var newAppointmentId = Convert.ToInt32(result);
                        return Ok(new AddAppointmentResponse { AppointmentId = newAppointmentId, Status = GeneralResponseStatusCode.Success });
                    }
                    else
                    {
                        return Ok(new AddAppointmentResponse { Status = GeneralResponseStatusCode.Failure });
                    }

                }
            }
            catch (Exception ex)
            {

                _logger.LogError(ex, "error while adding appointment");
                return Ok(new AddAppointmentResponse { Status = GeneralResponseStatusCode.Failure });
            }
        }

        [HttpDelete("DeleteAppointment")]
        public async Task<IActionResult> DeleteAppointment([FromQuery] int appointmentId)
        {
            try
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    var command = new SqlCommand("DELETE FROM Appointments WHERE AppointmentId = @AppointmentId", connection);
                    command.Parameters.AddWithValue("@AppointmentId", appointmentId);

                    int result = await command.ExecuteNonQueryAsync();
                    if (result > 0)
                    {
                        return Ok(GeneralResponseStatusCode.Success);
                    }
                    else
                    {
                        return Ok(GeneralResponseStatusCode.Failure);
                    }
                }
            }
            catch (SqlException ex)
            {
                 _logger.LogError(ex, "sql error while deleting appointment");
                return Ok(GeneralResponseStatusCode.Failure);
            }
            catch (Exception ex)
            {
                // Log and handle generic errors
                _logger.LogError(ex, "error while deleting appointment");
                return Ok(GeneralResponseStatusCode.Failure);
            }
        }
    }
}
