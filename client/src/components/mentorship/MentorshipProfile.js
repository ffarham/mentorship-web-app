import React, { useState } from 'react';
import {
    Row, 
    Col, 
    Button,
    Modal, 
    Card
} from 'reactstrap';

import MileStonesPanel from "../milestones/MileStonesPanel";
import PlanOfAction from "../plan-of-action/PlanOfAction";
import Meeting from "./Meeting";
import api from "../../api/api";

function MentorshipProfile({ profileView, setProfileView }){

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userID = authState.userID;
    const userType = authState.userType;

     // keep track of plan of action pop up
     const [activePoA, setActivePoA] = useState({});
     const [popUp, setPopUp] = useState(false);
     const handlePlanOfActionClick = (planOfAction) => {
         setActivePoA(planOfAction);
         setPopUp(true);
     };
 
     // keep track of active meeting
     const [activeMeeting, setActiveMeeting] = useState([]);
     const [meetingPopup, setMeetingPopup] = useState(false);
     const handleMeetingClick = (meeting) => {
         setActiveMeeting(meeting);
         setMeetingPopup(true);
     }

     // endpoint to mark a plan of action as complete
    const markComplete = () => {
        api.post(`/api/v1/markPOAcomplete/${activePoA.id}`).then(
            (res) => {
                
            }
        );
    }

    // if a mentee cancels a meeting
    const handleMeetingCancel = () => {

    }

    // if a mentor reschedules a meeting
    const handleMeetingReschedule = () => {

    }

    return(
        <>
            <Row className="mb-3">
                <Col lg="1">
                </Col>
                <Col lg="10">
                    <Button 
                        color="primary" 
                        type="button"
                        onClick={() => setProfileView({})}>
                        Return
                    </Button>
                </Col>
                <Col lg="1">
                </Col>
            </Row>
            <Row>
                <Col lg="1">
                </Col>

                <Col lg="10">
                    <Card className="bg-secondary shadow border-0">
                        <div className=" mt-3 mx-5">
                            <Row>
                                <Col lg="2">
                                    <Row>
                                        {profileView.userType === "mentee"
                                        ? <div className="card-profile-image mb-2">
                                            <img
                                            alt="..."
                                            className="mento-mentee-image rounded-circle"
                                            src={require("assets/img/mentorship/mentee01.png")}
                                            />
                                        </div>
                                        : <div className="card-profile-image mb-2">
                                            <img
                                            alt="..."
                                            className="mento-mentee-image"
                                            src={require("assets/img/mentorship/mentor01.png")}
                                            />
                                        </div>
                                        }
                                    </Row>
                                    <Row>
                                        <div>
                                            <p>{profileView.name}</p>
                                        </div>
                                    </Row>
                                </Col>
                                <Col lg="10">
                                    <Row>
                                        <Col lg="4">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                Department
                                            </small>
                                        </Col>
                                        <Col lg="8">
                                            <div>
                                                <p>{profileView.department}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                    <Col lg="4">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                Bio
                                            </small>
                                        </Col>
                                        <Col lg="8">
                                            <div>
                                                <p>{profileView.bio}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </Col>

                <Col lg="1">
                </Col>
            </Row>
            
            <div className="mx-9">
                <hr/>
            </div>

            <Row>
                <Col lg="1"></Col>
                <Col lg="5">
                    <Card className="bg-secondary shadow border-0">
                        <div className="text-center mt-4">
                            <h4 className="display-4 mb-0">Meetings</h4>
                        </div>
                        <div className="mx-4">
                            <hr/>
                        </div>
                        {profileView.meetings.length === 0
                        ? <div className="ml-4">
                            <p>Empty</p>
                        </div>
                        : <div className="scrollView">
                                {profileView.meetings.map( (meeting) => {
                                return(
                                    <div onClick={() => handleMeetingClick(meeting)}>
                                        <Meeting data={meeting} from="mentorship"/>
                                    </div>
                                );
                            })}
                        </div>}

                        <Modal
                            className="modal-dialog-centered"
                            isOpen={meetingPopup}
                            toggle={() => setMeetingPopup(false)}
                            >
                            <div className="modal-header">
                                <h6 className="modal-title mt-2" id="modal-title-default">
                                {activeMeeting.type === "meeting"
                                ? "Meeting"
                                : activeMeeting.type === "group-meeting"
                                ? "Group Meeting"
                                : "Workshop"}
                                </h6>
                                <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setMeetingPopup(false)}
                                >
                                <span aria-hidden={true}>×</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <Row>
                                    <Col lg="4">
                                        <div className="text-left">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                {activeMeeting.type === "workshop"
                                                ? "Expert"
                                                : userType === "mentor" ? "Mentee" : "Mentor"}
                                            </small>
                                        </div>
                                    </Col>
                                    <Col lg="8">
                                        <p>
                                            {userType === "mentor" ? activeMeeting.mentee : activeMeeting.mentor}
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="4">
                                        <div className="text-left">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                Name
                                            </small>
                                        </div>
                                    </Col>
                                    <Col lg="8">
                                        <p>
                                            {activeMeeting.meetingName}
                                        </p>
                                    </Col>
                                </Row>
                                {activeMeeting.type === "workshop"
                                && <Row>
                                    <Col lg="4">
                                        <div className="text-left">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                Description
                                            </small>
                                        </div>
                                    </Col>
                                    <Col lg="8">
                                        <p>
                                            {activeMeeting.description}
                                        </p>
                                    </Col>
                                </Row>
                                }
                                <Row>
                                    <Col lg="4">
                                        <div className="text-left">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                Start 
                                            </small>
                                        </div>
                                    </Col>
                                    <Col lg="8">
                                        <p>
                                            {activeMeeting.meetingStart}
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="4">
                                        <div className="text-left">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                Duaration 
                                            </small>
                                        </div>
                                    </Col>
                                    <Col lg="8">
                                        <p>
                                            {activeMeeting.duaration}
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="4">
                                        <div className="text-left">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                Location 
                                            </small>
                                        </div>
                                    </Col>
                                    <Col lg="8">
                                        <p>
                                            {activeMeeting.place}
                                        </p>
                                    </Col>
                                </Row>
                            </div>

                            <div className="modal-footer">
                                {!activeMeeting.attended 
                                ? userType === "mentee"
                                ? <Button 
                                    color="danger" 
                                    type="button"
                                    onClick={handleMeetingCancel}>
                                    Cancel 
                                </Button> 
                                : <Button 
                                    color="warning" 
                                    type="button"
                                    onClick={handleMeetingReschedule}>
                                    Reschedule
                                </Button> 
                                : <></>
                                }
                                <Button
                                className="ml-auto"
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setMeetingPopup(false)}
                                >
                                Close
                                </Button>
                            </div>
                            </Modal>

                    </Card>
                </Col>

                <Col lg="5">
                    <Card className="bg-secondary shadow border-0">
                        <div className="text-center mt-4">
                            <h4 className="display-4 mb-0">Plan of Actions</h4>
                        </div>
                        <div className="mx-4">
                            <hr/>
                        </div>
                        {profileView.planOfActions.length === 0
                            ? <div className="ml-4">
                                <p>Empty</p>
                            </div>
                            : <div className="scrollView">
                                {profileView.planOfActions.map( (planOfAction) => {
                                    return(
                                        <div onClick={() => handlePlanOfActionClick(planOfAction)}>
                                            <PlanOfAction data={planOfAction} from="mentorship"/>
                                        </div>
                                    );
                                })}
                            </div>}

                            <Modal
                            className="modal-dialog-centered"
                            isOpen={popUp}
                            toggle={() => setPopUp(false)}
                            >
                            <div className="modal-header">
                                <h6 className="modal-title mt-2" id="modal-title-default">
                                {activePoA.planName}
                                </h6>
                                <button
                                aria-label="Close"
                                className="close"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setPopUp(false)}
                                >
                                <span aria-hidden={true}>×</span>
                                </button>
                            </div>

                            <div className="modal-body">
                                <p>
                                    {activePoA.planDescription}
                                </p>
                                <MileStonesPanel data={activePoA.milestones}/>            
                            </div>

                            <div className="modal-footer">
                                {userType === "mentee" 
                                ? <></>
                                : <Button 
                                        color="primary" 
                                        type="button"
                                        onClick={markComplete}>
                                        Mark as Complete
                                    </Button> 
                                }
                                <Button
                                className="ml-auto"
                                color="link"
                                data-dismiss="modal"
                                type="button"
                                onClick={() => setPopUp(false)}
                                >
                                Close
                                </Button>
                            </div>
                            </Modal>
                    </Card>
                </Col>

                <Col lg="1"></Col>
            </Row>
        </>
    );
}

export default MentorshipProfile;