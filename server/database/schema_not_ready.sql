DROP DATABASE IF EXISTS discipulo;
CREATE DATABASE discipulo;

--Authentication System:

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    email VARCHAR(320) PRIMARY KEY, --Emails are max 320 characters long, they are also unique
    emailVerified BOOLEAN, --false if email not yet verified, true otherwise

    name VARCHAR(100) NOT NULL,
    --fname VARCHAR(100) NOT NULL,
    --lname VARCHAR(100) NOT NULL,
    --maybe change name field to above

    password BYTEA NOT NULL, --This will be hashed using sha512 with salt
    salt BYTEA NOT NULL, --64-bit number in base64

    businessArea VARCHAR(100)
);

DROP TABLE IF EXISTS authToken CASCADE;
CREATE TABLE authToken (
    token VARCHAR(64) PRIMARY KEY,
    email varchar(320) REFERENCES users(email) NOT NULL,
    kind VARCHAR(6) NOT NULL, --Either 'mentee' or 'mentor' (this field could change very soon)

    timeCreated TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL, --Token is not valid if timeCreated + duration > NOW()

    CONSTRAINT legalKind CHECK (kind = 'mentee' OR kind = 'mentor') --May become unneccesary
);

--Mentees/Mentors:

DROP TABLE IF EXISTS mentee CASCADE;
CREATE TABLE mentee (
    email VARCHAR(320) PRIMARY KEY REFERENCES users(email)
);

DROP TABLE IF EXISTS mentor CASCADE;
CREATE TABLE mentor (
    email VARCHAR(320) PRIMARY KEY REFERENCES users(email),

    rating REAL,
    numRatings INTEGER NOT NULL
);

DROP TABLE IF EXISTS mentoring CASCADE;
CREATE TABLE mentoring (
    mentorEmail VARCHAR(320) NOT NULL REFERENCES mentor(email),
    menteeEmail VARCHAR(320) NOT NULL REFERENCES mentee(email)
);

--Interests:

DROP TABLE IF EXISTS interest CASCADE;
CREATE TABLE interest (
    email VARCHAR(320) NOT NULL REFERENCES users(email),
    interest VARCHAR(100) NOT NULL,
    kind VARCHAR(6), --Either 'mentee' or 'mentor'

    CONSTRAINT legalKind CHECK (kind = 'mentee' OR kind = 'mentor')
);

--Meetings:

DROP TABLE IF EXISTS meetingRequests CASCADE;
CREATE TABLE meetingRequests(
    
);

DROP TABLE IF EXISTS meeting CASCADE;
CREATE TABLE meeting (
    meetingID SERIAL PRIMARY KEY,

    mentorEmail VARCHAR(320) NOT NULL REFERENCES mentor(email),
    menteeEmail VARCHAR(320) NOT NULL REFERENCES mentee(email),

    timeCreated TIMESTAMP NOT NULL,
    meetingStart TIMESTAMP,
    meetingEnd TIMESTAMP,

    attended BOOLEAN,

    feedback VARCHAR(1000)
);

--Group sessions:

DROP TABLE IF EXISTS groupMeeting CASCADE;
CREATE TABLE groupMeeting(
    groupMeetingID SERIAL PRIMARY KEY,
    mentorEmail VARCHAR(320) NOT NULL REFERENCES users(email)
);

DROP TABLE IF EXISTS groupMeetingAttendees CASCADE;
CREATE TABLE groupMeetingAttendees(
    groupMeetingID INTEGER NOT NULL REFERENCES groupMeeting(groupMeetingID),
    menteeEmail VARCHAR(320) NOT NULL REFERENCES users(email),

    accepted BOOLEAN,
    attended BOOLEAN
);

--Workshops?:



--Plans of action:



--Notifications:

DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
    notificationID INTEGER PRIMARY KEY,
    email VARCHAR(320) REFERENCES users(email),
    msg VARCHAR(1000) NOT NULL
);