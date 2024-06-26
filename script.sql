USE [master]
GO
/****** Object:  User [##MS_PolicyEventProcessingLogin##]    Script Date: 19/04/2024 18:14:23 ******/
CREATE USER [##MS_PolicyEventProcessingLogin##] FOR LOGIN [##MS_PolicyEventProcessingLogin##] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  User [##MS_AgentSigningCertificate##]    Script Date: 19/04/2024 18:14:23 ******/
CREATE USER [##MS_AgentSigningCertificate##] FOR LOGIN [##MS_AgentSigningCertificate##]
GO
/****** Object:  Table [dbo].[Appointments]    Script Date: 19/04/2024 18:14:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Appointments](
	[AppointmentId] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[CreationTime] [datetime2](7) NOT NULL,
	[AppointmentTime] [datetime2](7) NOT NULL,
	[FirstName] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[AppointmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 19/04/2024 18:14:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](255) NOT NULL,
	[Password] [nvarchar](255) NOT NULL,
	[FirstName] [nvarchar](255) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[Username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Appointments] ADD  DEFAULT (getdate()) FOR [CreationTime]
GO
ALTER TABLE [dbo].[Appointments]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO
/****** Object:  StoredProcedure [dbo].[spAddAppointment]    Script Date: 19/04/2024 18:14:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spAddAppointment]
    @UserId INT,
    @FirstName NVARCHAR(255),
    @AppointmentTime DATETIME
AS
BEGIN
    INSERT INTO Appointments (UserId, FirstName, AppointmentTime)
    VALUES (@UserId, @FirstName, @AppointmentTime);

    SELECT SCOPE_IDENTITY() AS NewAppointmentId;  -- Returns the ID of the newly created appointment
END;
GO
/****** Object:  StoredProcedure [dbo].[spAddUser]    Script Date: 19/04/2024 18:14:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spAddUser]
    @Username NVARCHAR(255),
    @Password NVARCHAR(255),
    @FirstName NVARCHAR(255),
    @Result INT OUTPUT -- Modified to use an INT for status codes
AS
BEGIN
    -- Check if the username already exists
    IF EXISTS (SELECT 1 FROM Users WHERE Username = @Username)
    BEGIN
        SET @Result = 1; -- Username exists
        RETURN;
    END

    BEGIN TRY
        -- Insert the new user
        INSERT INTO Users (Username, Password, FirstName)
        VALUES (@Username, @Password, @FirstName);

        SET @Result = 0; -- Success
    END TRY
    BEGIN CATCH
        SET @Result = 2; -- Other failure
    END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[spAuthenticateUser]    Script Date: 19/04/2024 18:14:23 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE  PROCEDURE [dbo].[spAuthenticateUser]
    @Username NVARCHAR(255),
	@UserId INT OUTPUT,
    @StoredHash NVARCHAR(255) OUTPUT, -- Return the hash instead of verifying it here
	@FirstName NVARCHAR(255) OUTPUT
AS
BEGIN

	SELECT 
        @UserId = UserId, 
        @FirstName = FirstName,
        @StoredHash = Password
    FROM Users 
    WHERE Username = @Username;
   
    IF @StoredHash IS NULL
    BEGIN
        SET @UserId = NULL; -- Indicate user not found
        SET @FirstName = NULL;
    END
END
GO
