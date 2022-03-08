import React from 'react';
import {
    Card,
    Row,
    Col
} from 'reactstrap';

function MentorMentee({ mentorMentees }){

    console.log(mentorMentees);

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userID = authState.userID;
    const userType = authState.userType;

    return(
        <>
            <Card className="mentorshipItem text-center p-3">
                {mentorMentees.userType === "mentor" 
                ? <div className="card-profile-image mb-2">
                    <img
                    alt="..."
                    className="mento-mentee-image"
                    src={require("assets/img/mentorship/mentor01.png")}
                    />
                </div>
                : <div className="card-profile-image mb-2">
                    <img
                    alt="..."
                    className="mento-mentee-image"
                    src={require("assets/img/mentorship/mentee01.png")}
                    />
                </div>
                }
                <div>
                    <h3 className="heading mb-0">{mentorMentees.name}</h3>
                </div>
            </Card>
        </>
    );
}

export default MentorMentee;