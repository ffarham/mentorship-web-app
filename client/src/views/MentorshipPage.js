import React, {useState, useEffect} from 'react';
import {
    Container,
    Col,
    Row,
} from 'reactstrap'; 

import MainNavbar from "../components/Navs/MainNavbar.js";
import MainFooter from "../components/Navs/MainFooter.js";
import MentorshipPanel from "../components/mentorship/MentorshipPanel";
import MentorshipRequest from "../components/mentorship/MentorshipRequest";
import MentorshipProfile from "../components/mentorship/MentorshipProfile.js";
import FindMentor from "../components/mentorship/FindMentor.js";
import api from "../api/api";

function MentorshipPage(){

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userID = authState.userID;
    const userType = authState.userType;

    // kepp track of whether the user has clicked a profile
    const [profileView, setProfileView] = useState({});

    // keep track of whether the user is finding new mentors
    const [findMentorView, setFindMentorView] = useState(false);

    // store users list of mentor/mentees 
    const [mentorMentees, setMentorMentees] = useState([]);

    // get users mentor-mentees
    useEffect(() => {
        api.get(`/api/v1/mentorship/${userID}/${userType}`).then(
            (res) => {
                setMentorMentees(res.data);
            }
        );
    }, []);

    return (
        <>
            <MainNavbar activeView="mentorship"/>
            
            <div className="text-center mt-4">
                <h3 className="display-3 mb-0">Mentorship</h3>
            </div>
            <div className="mx-4">
                <hr/>
            </div>
            
            <Container fluid="xl" >
                {findMentorView 
                ? <FindMentor setFindMentorView={setFindMentorView} />
                : Object.keys(profileView).length === 0
                ? <Row className="mx-3">
                    <Col lg="8">
                        <MentorshipPanel data={mentorMentees} setProfileView={setProfileView} setFindMentorView={setFindMentorView}/>
                    </Col>

                    <Col lg="4">
                        <Row>
                            <Col>
                                <MentorshipRequest />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                : <MentorshipProfile profileView={profileView} setProfileView={setProfileView} />
                }

            </Container>

            <MainFooter />
        </>
    );
    
}

export default MentorshipPage;