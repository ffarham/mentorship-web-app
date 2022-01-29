DROP DATABASE IF EXISTS discipulo;
CREATE DATABASE discipulo;
\connect discipulo;

--Authentication System:

--TODO: Get rid of password stuff and make it work with auth0
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    userID UUID PRIMARY KEY DEFAULT gen_random_uuid(), --Random 64 bit number used for primary keys
    email VARCHAR(320) NOT NULL UNIQUE, --Emails are max 320 characters long, they are also unique
    emailVerified BOOLEAN NOT NULL, --false if email not yet verified, true otherwise

    name VARCHAR(100) NOT NULL,
    --fname VARCHAR(100) NOT NULL,
    --lname VARCHAR(100) NOT NULL,
    --maybe change name field to above

    password BYTEA NOT NULL, --This will be hashed using bcrypt with salt
    salt BYTEA NOT NULL, --128-bit number

    businessArea VARCHAR(100)
);

DROP TABLE IF EXISTS authToken CASCADE;
CREATE TABLE authToken (
    token BYTEA PRIMARY KEY, --Random 64 bit number 
    userID UUID REFERENCES users(userID) NOT NULL,
    kind VARCHAR(6) NOT NULL, --Either 'mentee' or 'mentor' (this field could change very soon)

    timeCreated TIMESTAMP NOT NULL,
    duration INTERVAL NOT NULL, --Token is not valid if timeCreated + duration > NOW()

    CONSTRAINT legalKind CHECK (kind = 'mentee' OR kind = 'mentor') --May become unneccesary
);

--Mentees/Mentors:

DROP TABLE IF EXISTS mentee CASCADE;
CREATE TABLE mentee (
    menteeID UUID PRIMARY KEY REFERENCES users(userID)
);

DROP TABLE IF EXISTS mentor CASCADE;
CREATE TABLE mentor (
    mentorID UUID PRIMARY KEY REFERENCES users(userID),

    rating REAL,
    numRatings INTEGER NOT NULL
);

DROP TABLE IF EXISTS mentoring CASCADE;
CREATE TABLE mentoring (
    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID)
);

--Interests:

DROP TABLE IF EXISTS interest CASCADE;
CREATE TABLE interest (
    userID UUID NOT NULL REFERENCES users(userID),
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
    meetingID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    timeCreated TIMESTAMP NOT NULL,
    meetingStart TIMESTAMP,
    meetingEnd TIMESTAMP,

    attended BOOLEAN,

    feedback VARCHAR(1000)
);

--Group sessions:

DROP TABLE IF EXISTS groupMeeting CASCADE;
CREATE TABLE groupMeeting(
    groupMeetingID UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

DROP TABLE IF EXISTS groupMeetingMentors CASCADE;
CREATE TABLE groupMeetingMentors(
    groupMeetingID INTEGER NOT NULL REFERENCES groupMeeting(groupMeetingID)
);

DROP TABLE IF EXISTS groupMeetingAttendees CASCADE;
CREATE TABLE groupMeetingAttendees(
    groupMeetingID INTEGER NOT NULL REFERENCES groupMeeting(groupMeetingID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    accepted BOOLEAN,
    attended BOOLEAN
);

--Workshops?:



--Plans of action:



--Notifications:

DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
    notificationID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userID BYTEA REFERENCES users(userID),
    msg VARCHAR(1000) NOT NULL
);