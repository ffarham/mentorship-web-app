--DROP DATABASE IF EXISTS discipulo;
--CREATE DATABASE discipulo;
\connect discipulo;
--Authentication System:

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    userID UUID PRIMARY KEY DEFAULT gen_random_uuid(), --Random 64 bit number used for primary keys
    email VARCHAR(320) NOT NULL UNIQUE, --Emails are max 320 characters long, they are also unique
    emailVerified BOOLEAN NOT NULL, --false if email not yet verified, true otherwise

    name VARCHAR(100) NOT NULL,

    password CHAR(60) NOT NULL, --This will be hashed using bcrypt (bcrypt includes a salt in this value)

    businessArea VARCHAR(100),

    profilePicReference VARCHAR(200),

    emailsAllowed BOOLEAN NOT NULL,

    bio VARCHAR(1000)
);

DROP TABLE IF EXISTS authToken CASCADE;
CREATE TABLE authToken(
    token UUID PRIMARY KEY,
    userID UUID NOT NULL REFERENCES users(userID) ON DELETE CASCADE,
    
    timeCreated TIMESTAMP NOT NULL,
    timeToLive INTERVAL NOT NULL,

    kind CHAR(3) NOT NULL, --Either 'acc' for access or 'ref' for refresh.

    depracated BOOLEAN,

    loggedInAs CHAR(6) NOT NULL, --Either 'mentee' or 'mentor'

    CONSTRAINT legalKind CHECK (kind = 'acc' OR kind = 'ref'),
    CONSTRAINT legalLoggedInAs CHECK (loggedInAs = 'mentee' OR loggedInAs = 'mentor')
);

--Mentees/Mentors:

DROP TABLE IF EXISTS mentee CASCADE;
CREATE TABLE mentee (
    menteeID UUID PRIMARY KEY REFERENCES users(userID) ON DELETE CASCADE
);

DROP TABLE IF EXISTS mentor CASCADE;
CREATE TABLE mentor (
    mentorID UUID PRIMARY KEY REFERENCES users(userID) ON DELETE CASCADE
);

DROP TABLE IF EXISTS mentorshipRequests CASCADE;
CREATE TABLE mentorshipRequests (
    requestID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentorID UUID NOT NULL REFERENCES mentor(mentorID) ON DELETE CASCADE,
    menteeID UUID NOT NULL REFERENCES mentee(menteeID) ON DELETE CASCADE,
    status VARCHAR(10) DEFAULT 'pending' --accepted, rejected or pending
);

DROP TABLE IF EXISTS mentoring CASCADE;
CREATE TABLE mentoring (
    mentorID UUID NOT NULL REFERENCES mentor(mentorID) ON DELETE CASCADE,
    menteeID UUID NOT NULL REFERENCES mentee(menteeID) ON DELETE CASCADE,
    PRIMARY KEY (mentorID, menteeID)
);

--Interests:

DROP TABLE IF EXISTS interestType CASCADE;
CREATE TABLE interestType (
    interest VARCHAR(100) PRIMARY KEY
);

DROP TABLE IF EXISTS interest CASCADE;
CREATE TABLE interest (
    userID UUID NOT NULL REFERENCES users(userID) ON DELETE CASCADE,
    interest VARCHAR(100) NOT NULL REFERENCES interestType(interest) ON DELETE CASCADE,
    kind CHAR(6), --Either 'mentee' or 'mentor',
    ordering INTEGER NOT NULL,

    CONSTRAINT legalKind CHECK (kind = 'mentee' OR kind = 'mentor')
);

--Meetings:

DROP TABLE IF EXISTS meeting CASCADE;
CREATE TABLE meeting (
    meetingID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    meetingName VARCHAR(100),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID) ON DELETE CASCADE,
    menteeID UUID NOT NULL REFERENCES mentee(menteeID) ON DELETE CASCADE,

    timeCreated TIMESTAMP NOT NULL,
    meetingStart TIMESTAMP,
    meetingDuration INTERVAL,
    
    place VARCHAR(100),

    confirmed VARCHAR(10), --true, false, or reschedule

    status VARCHAR(10) DEFAULT('pending'), 

    attended BOOLEAN,

    requestMessage VARCHAR(1000),

    menteeFeedback VARCHAR(1000),
    mentorFeedback VARCHAR(1000),

    description VARCHAR(1000),

    CONSTRAINT legalConfirmed CHECK (confirmed = 'true' OR confirmed = 'false' OR confirmed = 'reschedule'),
    CONSTRAINT legalStatus CHECK (status = 'pending' OR status = 'ongoing' OR status = 'reschedule' OR status = 'finished')
);

--Group sessions:

DROP TABLE IF EXISTS groupMeeting CASCADE;
CREATE TABLE groupMeeting(
    groupMeetingID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    groupMeetingName VARCHAR(100),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID) ON DELETE CASCADE,

    timeCreated TIMESTAMP NOT NULL,
    meetingStart TIMESTAMP,
    meetingDuration INTERVAL,

    kind VARCHAR(30), --'group-meeting' or 'workshop'
    
    place VARCHAR(100),

    attended BOOLEAN,

    status VARCHAR(10) DEFAULT('ongoing'),

    description VARCHAR(1000),

    CONSTRAINT legalStatus CHECK (status = 'ongoing' OR status = 'finished')
);

DROP TABLE IF EXISTS groupMeetingFeedback CASCADE;
CREATE TABLE groupMeetingFeedback(
    groupMeetingFeedbackID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    groupMeetingID UUID NOT NULL REFERENCES groupMeeting(groupMeetingID),
    feedback VARCHAR(1000)
);

DROP TABLE IF EXISTS groupMeetingAttendee CASCADE;
CREATE TABLE groupMeetingAttendee(
    groupMeetingID UUID NOT NULL REFERENCES groupMeeting(groupMeetingID) ON DELETE CASCADE,
    menteeID UUID NOT NULL REFERENCES users(userID) ON DELETE CASCADE,
    meetingStatus VARCHAR(10), /* DEFAULT('ongoing'),*/
    menteeStatus VARCHAR(10),/* DEFAULT('pending'),*/

    confirmed BOOLEAN

    /*CONSTRAINT legalMeetingStatus CHECK (meetingStatus = 'ongoing' OR  meetingStatus = 'finished'),
    CONSTRAINT legalMenteeStatus CHECK (menteeStatus = 'pending'  OR menteeStatus = 'ongoing')*/
);

--Plans of action:

DROP TABLE IF EXISTS planOfAction CASCADE;
CREATE TABLE planOfAction(
    planID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID) ON DELETE CASCADE,
    menteeID UUID NOT NULL REFERENCES mentee(menteeID) ON DELETE CASCADE,

    planName VARCHAR(100),
    planDescription VARCHAR(1000),

    completed BOOLEAN
    --completionMessage VARCHAR(1000)
);

DROP TABLE IF EXISTS milestones CASCADE;
CREATE TABLE milestones(
    milestoneID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    planID UUID NOT NULL REFERENCES planOfAction(planID) ON DELETE CASCADE,

    ordering INTEGER NOT NULL,

    milestoneName VARCHAR(100),
    milestoneDescription VARCHAR(1000),

    completed BOOLEAN
    --completionMessage VARCHAR(1000)
); 

--Notifications:

DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
    notificationID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userID UUID REFERENCES users(userID) ON DELETE CASCADE,
    msg VARCHAR(1000) NOT NULL,

    timeCreated TIMESTAMP NOT NULL,

    kind VARCHAR(50),

    dismissed BOOLEAN NOT NULL

    --meetingID UUID REFERENCES meeting(meetingID)
);

--App feedback
DROP TABLE IF EXISTS appFeedback CASCADE;
CREATE TABLE appFeedback (
    appFeedbackID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rating INTEGER,
    feedback VARCHAR(1000)
);

--Functions:
CREATE OR REPLACE FUNCTION countAttendees(gmID UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS
$$
DECLARE
    attendees INTEGER;
BEGIN
    SELECT COUNT(*) FROM groupMeetingAttendee
        WHERE confirmed AND groupMeetingID = gmID
        INTO attendees;

    RETURN attendees;
END;
$$;
