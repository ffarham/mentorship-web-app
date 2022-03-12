import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Modal,
    Badge
} from 'reactstrap';

import api from "../../api/api";
import MentorshipRequest from "./MentorshipRequest";

function MentorshipRequestPanel(){

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userType = authState.userType;

    // alert
    const [alertPopup, setAlertPopup] = useState(false);
    const [alertBody, setAlertBody] = useState("");

    // handle user clicking on a request
    const [requestPopup, setRequestPopup] = useState(false);
    const [activeReq, setActiveReq] = useState({
        id: 1,
        user: {
            name: "",
            bio: "",
            department: "",
            email: "",
            interests: []
        }}
    );
    const handleRequestClick = (request) => {
        if(userType === "mentee"){
            return;
        }
        setActiveReq(request);
        setRequestPopup(true);
    }
    // handle accept request by mentor
    const handleAcceptRequest = (request) => {
        const requestID = request.id;
        api.post(`/api/v1/acceptMentorshipRequest/${requestID}`).then(
            (res) => {
                setRequestPopup(false);
                setAlertBody("Request has successfully been accepted.");
                setAlertPopup(true);
            }
        );
    }
    // handle reject request by mentor
    const handleRejectRequest = (request) => {
        const requestID = request.id;
        api.post(`/api/v1/rejectMentorshipRequest/${requestID}`).then(
            (res) => {
                setRequestPopup(false);
                setAlertBody("Request has successfully been rejected.");
                setAlertPopup(true);
            }
        );
    };

    // get all users requests
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        api.get("/api/v1/mentorship/requests").then(
            (res) => {
                setRequests(res.data);
            }
        );
    }, []);

    return(
        <>
            <Card className="bg-secondary shadow border-0">
                <Row className="mx-4 my-2"> 
                    <div className="mt-2 mb-2">
                        <h4 className="display-4 mb-0">Requests</h4>
                    </div>
                </Row>
                {/* <Row className="mx-4 my-2"> */}
                {requests.length === 0
                    ? <div className="mb-3">
                        You have no requests.
                    </div>
                    : <div className="scrollView mb-3">
                        {requests.map( (req) => {
                                return(
                                    <div onClick={() => handleRequestClick(req)}>
                                        <MentorshipRequest request={req} />
                                    </div>
                        );})
                        }
                        
                        <Modal
                        className="modal-dialog-centered"
                        isOpen={requestPopup}
                        toggle={() => setRequestPopup(false)}
                        >
                        <div className="modal-header">
                            <h6 className="modal-title mt-2" id="modal-title-default">
                                Mentorship request
                            </h6>
                            <button
                            aria-label="Close"
                            className="close"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setRequestPopup(false)}
                            >
                            <span aria-hidden={true}>×</span>
                            </button>
                        </div>

                        <div className="modal-body">
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
                                        {activeReq.user.name}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="4">
                                    <div className="text-left">
                                        <small className="text-uppercase text-muted font-weight-bold">
                                            Email 
                                        </small>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <p>
                                        {activeReq.user.email}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="4">
                                    <div className="text-left">
                                        <small className="text-uppercase text-muted font-weight-bold">
                                            Bio 
                                        </small>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <p>
                                        {activeReq.user.bio}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="4">
                                    <div className="text-left">
                                        <small className="text-uppercase text-muted font-weight-bold">
                                            Department 
                                        </small>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <p>
                                        {activeReq.user.department}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="4">
                                    <div className="text-left">
                                        <small className="text-uppercase text-muted font-weight-bold">
                                            Interests 
                                        </small>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <p>
                                        {activeReq.user.interests.map( (topic) => {
                                            return(
                                                <Badge className="text-uppercase mr-2 mb-1 px-2" color="primary" pill>
                                                    {topic}
                                                </Badge>
                                            );
                                        })}  
                                    </p>
                                </Col>
                            </Row>
                        </div>

                        <div className="modal-footer">
                            <Button 
                                    color="success" 
                                    type="button"
                                    onClick={() => handleAcceptRequest(activeReq)}>
                                    Accept
                                </Button> 
                                <Button 
                                    color="danger" 
                                    type="button"
                                    onClick={() => handleRejectRequest(activeReq)}>
                                    Reject
                                </Button>
                            <Button
                            className="ml-auto"
                            color="link"
                            data-dismiss="modal"
                            type="button"
                            onClick={() => setRequestPopup(false)}
                            >
                            Close
                            </Button>
                        </div>
                        </Modal>

                        <Modal
                        className="modal-dialog-centered"
                        isOpen={alertPopup}
                        toggle={() => setAlertPopup(false)}
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
                            onClick={() => setAlertPopup(false)}
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
                            onClick={() => setAlertPopup(false)}
                            >
                            Close
                            </Button>
                        </div>
                        </Modal>
                    </div>
                    }
                {/* </Row> */}
            </Card>
        </>
    );
}

export default MentorshipRequestPanel;