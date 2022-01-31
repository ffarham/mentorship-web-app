DROP DATABASE IF EXISTS discipulo;
CREATE DATABASE discipulo;
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
    menteeID UUID NOT NULL REFERENCES mentee(menteeID)
);

--Interests:

DROP TABLE IF EXISTS interest CASCADE;
CREATE TABLE interest (
    userID UUID NOT NULL REFERENCES users(userID),
    interest VARCHAR(100) NOT NULL,
    kind CHAR(6), --Either 'mentee' or 'mentor'

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
    meetingEnd TIMESTAMP,
    
    place VARCHAR(100),

    confirmed BOOLEAN,

    attended BOOLEAN,

    requestMessage VARCHAR(1000),
    feedback VARCHAR(1000)
);

--Group sessions:

DROP TABLE IF EXISTS groupMeeting CASCADE;
CREATE TABLE groupMeeting(
    groupMeetingID UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

DROP TABLE IF EXISTS groupMeetingMentors CASCADE;
CREATE TABLE groupMeetingMentors(
    groupMeetingID UUID NOT NULL REFERENCES groupMeeting(groupMeetingID),

    timeCreated TIMESTAMP NOT NULL,

    groupMeetingStart TIMESTAMP,
    groupMeetingEnd TIMESTAMP
);

DROP TABLE IF EXISTS groupMeetingAttendees CASCADE;
CREATE TABLE groupMeetingAttendees(
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

    completed BOOLEAN
);

DROP TABLE IF EXISTS milestones CASCADE;
CREATE TABLE milestones(
    milestoneID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    planID UUID NOT NULL REFERENCES planOfAction(planID),

    milestoneName VARCHAR(100),
    milestoneDescription VARCHAR(1000),

    completed BOOLEAN
); 

--Feedback:

DROP TABLE IF EXISTS menteeToMentorFeedback;
CREATE TABLE menteeToMentorFeedback(
    feedbackID UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    mentorID UUID NOT NULL REFERENCES mentor(mentorID),
    menteeID UUID NOT NULL REFERENCES mentee(menteeID),

    feedback VARCHAR(1000)
);

DROP TABLE IF EXISTS prosAndCons;
CREATE TABLe prosAndCons(
    feedbackID UUID NOT NULL REFERENCES menteeToMentorFeedback(feedbackID),

    kind CHAR(3), --Either 'pro' or 'con'

    content VARCHAR(100),

    CONSTRAINT legalKind CHECK (kind = 'pro' OR kind = 'con')
);

DROP TABLE IF EXISTS workshopFeedback;
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
    msg VARCHAR(1000) NOT NULL
);
