public enum GeneralResponseStatusCode
{
    Success = 0,
    Failure = 1,
}



public class Appointment
{
    public int AppointmentId { get; set; } // Primary key
    public int UserId { get; set; } // Foreign key referencing the User
    public DateTime CreationTime { get; set; }
    public DateTime AppointmentTime { get; set; }
    public string FirstName { get; set; }
}

public class AddAppointmentRequest
{
    public int UserId { get; set; } // Foreign key referencing the User
    public DateTime AppointmentTime { get; set; }
    public DateTime CreationTime { get; set; }
    public string FirstName { get; set; } // This might be redundant if it's always the same as the user's first name
    // Navigation property to link the user
}

public class AddAppointmentResponse
{
    public GeneralResponseStatusCode Status { get; set; }
    public int AppointmentId { get; set; }
}

public class GetAppointmentsResponse
{
    public GeneralResponseStatusCode Status { get; set; }
    public List<Appointment> Appointments { get; set; }
}

public class UpdateAppointmentRequest
{
    public int AppointmentId { get; set; }
    public DateTime AppointmentTime { get; set; }
}




