import React, { useState } from 'react';
import {
    Row, 
    Col, 
    Button,
    Modal, 
    Card,
    InputGroup,
    FormGroup,
    Input,
    Badge
} from 'reactstrap';

import PlanOfActionPanel from "../plan-of-action/PlanOfActionPanel";
import MeetingsPanel from "../meetings/MeetingsPanel";
import api from "../../api/api";

function MentorshipProfile({ profileView, setProfileView, setShowProfile }){

    console.log("profile view");
    console.log(profileView);

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userID = authState.userID;
    const userType = authState.userType;

    // alert pop ups
    const [successAlertPopup, setSuccessAlertPopup] = useState(false);
    const [alertBody, setAlertBody] = useState("");

    // mentor can create a plan-of-action
    const [planName, setPlanName] = useState("");
    const [planDescription, setPlanDescription] = useState("");
    const [createPOA, setCreatePOA] = useState(false);
    const handleCreatePOA = async (menteeID) => {
        // validate user input
        if(planName === ""){
            // TODO: notify user
            return;
        }
        const data = {
            planName: planName, 
            planDescription: planDescription
        };
        api.post(`/api/v1/createPOA/${menteeID}`, data).then(
            (res) => {
                // remove popup
                setCreatePOA(false);
                setAlertBody("Plan of action successfully created.");
                setSuccessAlertPopup(true);
            }
        );
    }

    // mentees have the option to remove mentors
    const handleMentorRemove = (otherID) => {
        api.post(`/api/v1/cancelMentorship/${otherID}`).then(
            (res) => {
                // take the user back to their mentorship page
                // TODO: notify the user, however issue with popup and changing view
                setProfileView({interests: []});
                setShowProfile(false);
            }
        );
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
                        onClick={() => (
                                setProfileView({interests: []}),
                                setShowProfile(false)
                        )
                        }>
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
                                        {userType === "mentor"
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
                                <Col lg="8">
                                    <Row>
                                        <Col lg="4">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                Email
                                            </small>
                                        </Col>
                                        <Col lg="8">
                                            <div>
                                                <p>{profileView.email}</p>
                                            </div>
                                        </Col>
                                    </Row>
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
                                    <Row className="mb-2">
                                        <Col lg="4">
                                            <small className="text-uppercase text-muted font-weight-bold">
                                                {userType === "mentor"
                                                ? "Interests"
                                                : "Specialties"}
                                            </small>
                                        </Col>
                                        <Col lg="8">
                                            {profileView.interests.map( (topic) => {
                                                return(
                                                    <Badge className="text-uppercase mr-2 mb-1 px-2" color="primary" pill>
                                                        {topic}
                                                    </Badge>
                                                );
                                            })}  
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg="2">
                                    {userType === "mentee"
                                        && <Row className="float-right">
                                            <Button 
                                                color="danger" 
                                                type="button"
                                                onClick={() => handleMentorRemove(profileView.otherID)}>
                                                Remove
                                            </Button>
                                        </Row>
                                    }
                                    {userType === "mentor"
                                    && <Row className="float-right mt-2">
                                            <Button
                                            color="info" 
                                            type="button"
                                            onClick={() => setCreatePOA(true)}>
                                                Create Plan 
                                            </Button>
                                        </Row>
                                    }
                                    {/* create plan of action popup */}
                                    <Modal 
                                        className="modal-dialog-centered"
                                        isOpen={createPOA}
                                        toggle={() => setCreatePOA(false)}
                                        >
                                        <div className="modal-header">
                                            <h6 className="modal-title mt-2" id="modal-title-default">
                                            Create a Plan of Action
                                            </h6>
                                            <button
                                            aria-label="Close"
                                            className="close"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() => setCreatePOA(false)}
                                            >
                                            <span aria-hidden={true}>×</span>
                                            </button>
                                        </div>

                                        <div className="modal-body">
                                            <Row className="mb-2">
                                                <Col lg="4">
                                                    <div className="mt-2">
                                                        <small className="text-uppercase text-muted font-weight-bold">
                                                            Name
                                                        </small>
                                                    </div>
                                                </Col>
                                                <Col lg="8">
                                                    <Input
                                                    className="form-control-alternative"
                                                    placeholder="Enter Plan Name"
                                                    type="text"
                                                    onChange={ (event) => {
                                                        setPlanName(event.target.value);
                                                    }}
                                                    />
                                                </Col>
                                            </Row>        
                                            <Row>
                                                <Col lg="4">
                                                    <small className="text-uppercase text-muted font-weight-bold">
                                                        Description
                                                    </small>
                                                </Col>
                                                <Col lg="8">
                                                    <FormGroup className="mb-3">
                                                        <InputGroup className="input-group-alternative">
                                                            <Input 
                                                                placeholder="Enter bio" 
                                                                type="textarea" 
                                                                onChange={ (event) => {
                                                                    setPlanDescription(event.target.value);
                                                                }}
                                                                />
                                                        </InputGroup>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </div>

                                        <div className="modal-footer">
                                            <Button 
                                                color="primary" 
                                                type="button"
                                                onClick={() => handleCreatePOA(profileView.otherID)}>
                                                Submit
                                            </Button> 
                                            <Button
                                            className="ml-auto"
                                            color="link"
                                            data-dismiss="modal"
                                            type="button"
                                            onClick={() => setCreatePOA(false)}
                                            >
                                            Close
                                            </Button>
                                        </div>
                                    </Modal>
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
                    <MeetingsPanel context="mentorship" otherID={profileView.otherID}/>
                </Col>
                <Col lg="5">
                    <PlanOfActionPanel context="mentorship" otherID={profileView.otherID}/>
                </Col>
                <Col lg="1"></Col>
            </Row>

              {/* success alert popup */}
              <Modal
                    className="modal-dialog-centered"
                    isOpen={successAlertPopup}
                    toggle={() => setSuccessAlertPopup(false)}
                    >
                    <div className="modal-header">
                        <h6 className="modal-title mt-2 text-success" id="modal-title-default">
                            Success
                        </h6>
                        <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setSuccessAlertPopup(false)}
                        >
                        <span aria-hidden={true}>×</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <p>{alertBody}</p>
                    </div>

                    <div className="modal-footer">
                        <Button
                        className="ml-auto"
                        color="link"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setSuccessAlertPopup(false)}
                        >
                        Close
                        </Button>
                    </div>
                </Modal>
        </>
    );
}

export default MentorshipProfile;