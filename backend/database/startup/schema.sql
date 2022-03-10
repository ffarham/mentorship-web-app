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
    userID UUID NOT NULL REFERENCES users(userID),
    
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
    menteeID UUID PRIMARY KEY REFERENCES users(userID)
);

DROP TABLE IF EXISTS mentor CASCADE;
CREATE TABLE mentor (
    mentorID UUID PRIMARY KEY REFERENCES users(userID)
);

DROP TABLE IF EXISTS mentorshipRequests CASCADE;
CREATE TABLE mentorshipRequests (
    requestID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),
    status VARCHAR(10) DEFAULT 'pending' --accepted, rejected or pending
);

DROP TABLE IF EXISTS mentoring CASCADE;
CREATE TABLE mentoring (
    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),
    PRIMARY KEY (mentorID, menteeID)
);

--Interests:

DROP TABLE IF EXISTS interestType CASCADE;
CREATE TABLE interestType (
    interest VARCHAR(100) PRIMARY KEY
);

DROP TABLE IF EXISTS interest CASCADE;
CREATE TABLE interest (
    userID UUID NOT NULL REFERENCES users(userID),
    interest VARCHAR(100) NOT NULL REFERENCES interestType(interest),
    kind CHAR(6), --Either 'mentee' or 'mentor',
    ordering INTEGER NOT NULL,

    CONSTRAINT legalKind CHECK (kind = 'mentee' OR kind = 'mentor')
);

--Meetings:

DROP TABLE IF EXISTS meeting CASCADE;
CREATE TABLE meeting (
    meetingID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    meetingName VARCHAR(100),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    timeCreated TIMESTAMP NOT NULL,
    meetingStart TIMESTAMP,
    meetingDuration INTERVAL,
    
    place VARCHAR(100),

    confirmed VARCHAR(10), --true, false, or reschedule

    attended BOOLEAN,

    requestMessage VARCHAR(1000),

    menteeFeedback VARCHAR(1000),
    mentorFeedback VARCHAR(100),

    description VARCHAR(1000),

    CONSTRAINT legalConfirmed CHECK (confirmed = 'true' OR confirmed = 'false' OR confirmed = 'reschedule')
);

--Group sessions:

DROP TABLE IF EXISTS groupMeeting CASCADE;
CREATE TABLE groupMeeting(
    groupMeetingID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    groupMeetingName VARCHAR(100),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID),

    timeCreated TIMESTAMP NOT NULL,
    meetingStart TIMESTAMP,
    meetingDuration INTERVAL,

    kind VARCHAR(12),
    
    place VARCHAR(100),

    attended BOOLEAN,

    description VARCHAR(1000)
);

DROP TABLE IF EXISTS groupMeetingAttendee CASCADE;
CREATE TABLE groupMeetingAttendee(
    groupMeetingID UUID NOT NULL REFERENCES groupMeeting(groupMeetingID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    confirmed BOOLEAN,

    feedback VARCHAR(1000)
);

--Workshops:

DROP TABLE IF EXISTS workshop CASCADE;
CREATE TABLE workshop(
    workshopID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    leaderID UUID NOT NULL REFERENCES mentor(mentorID),

    timeCreated TIMESTAMP NOT NULL,

    workshopStart TIMESTAMP,
    workshopEnd TIMESTAMP
);

DROP TABLE IF EXISTS workshopTopics CASCADE;
CREATE TABLE workshopTopics(
    workshopID UUID NOT NULL REFERENCES workshop(workshopID),
    topic VARCHAR(100) NOT NULL --Should exist in interests table somewhere
);

--Plans of action:

DROP TABLE IF EXISTS planOfAction CASCADE;
CREATE TABLE planOfAction(
    planID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    planName VARCHAR(100),
    planDescription VARCHAR(1000),

    completed BOOLEAN
    --completionMessage VARCHAR(1000)
);

DROP TABLE IF EXISTS milestones CASCADE;
CREATE TABLE milestones(
    milestoneID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    planID UUID NOT NULL REFERENCES planOfAction(planID),

    ordering INTEGER NOT NULL,

    milestoneName VARCHAR(100),
    milestoneDescription VARCHAR(1000),

    completed BOOLEAN
    --completionMessage VARCHAR(1000)
); 

--Feedback:

DROP TABLE IF EXISTS mentorToMenteeFeedback CASCADE;
CREATE TABLE mentorToMenteeFeedback(
    feedbackID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    meetingID UUID REFERENCES meeting(meetingID),
    groupMeetingID UUID REFERENCES groupMeeting(groupMeetingID),

    feedback VARCHAR(1000)
);

DROP TABLE IF EXISTS menteeToMentorFeedback CASCADE;
CREATE TABLE menteeToMentorFeedback(
    feedbackID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    feedback VARCHAR(1000)
);

DROP TABLE IF EXISTS prosAndCons CASCADE;
CREATE TABLe prosAndCons(
    feedbackID UUID NOT NULL REFERENCES menteeToMentorFeedback(feedbackID),

    kind CHAR(3), --Either 'pro' or 'con'

    content VARCHAR(100),

    CONSTRAINT legalKind CHECK (kind = 'pro' OR kind = 'con')
);

DROP TABLE IF EXISTS workshopFeedback CASCADE;
CREATE TABLE workshopFeedback(
    workshopFeedbackID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    workshopID UUID NOT NULL REFERENCES workshop(workshopID),

    feedback VARCHAR(1000)
);

--Notifications:

DROP TABLE IF EXISTS notifications CASCADE;
CREATE TABLE notifications (
    notificationID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userID UUID REFERENCES users(userID),
    msg VARCHAR(1000) NOT NULL,

    timeCreated TIMESTAMP NOT NULL,

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