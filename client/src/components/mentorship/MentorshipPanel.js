import React, { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Row,
    Col,
    Button,
    Modal
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import MentorMentee from "./MentorMentee";
import MentorMenteeProfile from "../../views/MentorMenteeProfile";

function MentorshipPanel({ data, setProfileView, setFindMentorView }){

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userID = authState.userID;
    const userType = authState.userType;

    const emptyMsg = userType == "mentee" ? "You have no assigned mentors." : "You have no assigned mentees.";
    const subTitle = userType === "mentee" ? "Mentors" : "Mentees";

    const handleMentorMenteeClick = (value) => {
        setProfileView(value);
    }

    const [maxPopup, setMaxPopup] = useState(false);
    const handleFindMentor = () => {
        // maximum number of mentors/mentees allowed are 5
        if(data.length === 5){
            setMaxPopup(true);
        }else{
            setFindMentorView(true);
        }
    }

    return (
        <>
            <Container fluid="xl">
                <Card className="bg-secondary shadow border-0 ">
                    <Row className="mx-3 mt-3 mb-2">
                        <Col lg="6">
                            <div>
                                <h4 className="display-4 mb-0">{subTitle}</h4>
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="float-right">
                                {userType === "mentor"
                                ? <></>
                                : <Button 
                                color="primary" 
                                type="button"
                                onClick={handleFindMentor}>
                                    Find a Mentor
                                </Button>
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row className="m-2 mx-3 mb-3">
                        {data.length === 0
                        ? <p>{emptyMsg}</p>
                        : data.map( (value) => {
                            return(
                                <div className="m-2">
                                    <a href="#group38" onClick={() => handleMentorMenteeClick(value)}>
                                        <MentorMentee mentorMentees={value} /> 
                                    </a>
                                </div>
                            );
                        })}
                    </Row>
                    
                   
                </Card>

                <Modal
                className="modal-dialog-centered"
                isOpen={maxPopup}
                toggle={() => setMaxPopup(false)}
                >
                <div className="modal-header">
                    <h6 className="modal-title mt-2" id="modal-title-default">
                        Alert
                    </h6>
                    <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setMaxPopup(false)}
                    >
                    <span aria-hidden={true}>×</span>
                    </button>
                </div>

                <div className="modal-body">
                    <p>
                        Users are only allowed to have a maximum of 5 {userType === "mentors" ? "mentees" : "mentors"}.
                    </p>
                </div>

                <div className="modal-footer">
                    <Button
                    className="ml-auto"
                    color="link"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setMaxPopup(false)}
                    >
                    Close
                    </Button>
                </div>
                </Modal>
            </Container>
        </>
    );
}   

export default MentorshipPanel;