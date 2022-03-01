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

    emailsAllowed BOOLEAN NOT NULL
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
    kind CHAR(6), --Either 'mentee' or 'mentor'
    rnk INTEGER NOT NULL,

    CONSTRAINT legalKind CHECK (kind = 'mentee' OR kind = 'mentor')
);

--Meetings:

DROP TABLE IF EXISTS meeting CASCADE;
CREATE TABLE meeting (
    meetingID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    timeCreated TIMESTAMP NOT NULL,
    meetingStart TIMESTAMP,
    meetingDuration INTERVAL,
    
    place VARCHAR(100),

    confirmed BOOLEAN,

    attended BOOLEAN,

    requestMessage VARCHAR(1000),
    feedback VARCHAR(1000)
);

--Group sessions:

DROP TABLE IF EXISTS groupMeeting CASCADE;
CREATE TABLE groupMeeting(
    groupMeetingID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID),

    timeCreated TIMESTAMP NOT NULL,
    meetingStart TIMESTAMP,
    meetingDuration INTERVAL,
    
    place VARCHAR(100)
);

DROP TABLE IF EXISTS groupMeetingAttendee CASCADE;
CREATE TABLE groupMeetingAttendee(
    groupMeetingID UUID NOT NULL REFERENCES groupMeeting(groupMeetingID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    accepted BOOLEAN,
    attended BOOLEAN
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

    completed BOOLEAN,
    completionMessage VARCHAR(1000)
);

DROP TABLE IF EXISTS milestones CASCADE;
CREATE TABLE milestones(
    milestoneID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    planID UUID NOT NULL REFERENCES planOfAction(planID),

    ordering INTEGER NOT NULL,

    milestoneName VARCHAR(100),
    milestoneDescription VARCHAR(1000),

    completed BOOLEAN,
    completionMessage VARCHAR(1000)
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

    meetingID UUID REFERENCES meeting(meetingID)
);