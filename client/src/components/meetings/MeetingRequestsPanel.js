import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Modal,
    Button,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from 'reactstrap';
import ReactDatetime from "react-datetime";
import MeetingRequest from "./MeetingRequest";
import api from "../../api/api";

function MeetingRequestsPanel(){

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
            meetingName: "",
            meetingDescription: "",
            otherName: "",
            meetingStart: "",
            meetingDescription: "",
            place: "",
        }}
    );
    const handleRequestClick = (request) => {
        setActiveReq(request);
        setRequestPopup(true);
    }

     // handle accept request 
     const handleAcceptRequest = (request) => {
        const meetingID = request.meetingID;
        const meetingType = request.meetingType;
        api.post(`/api/v1/acceptMeeting/${meetingID}/${meetingType}`).then(
            (res) => {
                setRequestPopup(false);
                setAlertBody("Request has successfully been accepted.");
                setAlertPopup(true);
            }
        );
    };

    // handle reject request 
    const handleRejectRequest = (request) => {
        const meetingID = request.meetingID;
        api.post(`/api/v1/rejectMeeting/${meetingID}`).then(
            (res) => {
                setRequestPopup(false);
                setAlertBody("Request has successfully been rejected.");
                setAlertPopup(true);
            }
        );
    };


    // get all of users meeting requests
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        api.get("/api/v1/getMeetingRequests").then(
            (res) => {
                console.log(res.data);
                setRequests(res.data);
            }
        );
    }, []);

    return(
        <>
            <Card className="bg-secondary shadow border-0">
                <Row className="mx-4 mt-2"> 
                    <div className="mt-2 mb-2">
                        <h4 className="display-4 mb-0">Requests</h4>
                    </div>
                </Row>
                <div className="mx-4">
                    <hr />
                </div>
                {requests.length === 0
                ? <div className="mb-3 ml-3">
                    You have no requests.
                </div>
                :<div className="scrollView mb-3">
                    {requests.map( (req) => {
                        return(
                            <div onClick={() => handleRequestClick(req)}>
                                <MeetingRequest request={req} />
                            </div>
                    );})
                    }
                </div>}

                <Modal
                        className="modal-dialog-centered"
                        isOpen={requestPopup}
                        toggle={() => setRequestPopup(false)}
                        >
                        <div className="modal-header">
                            <h6 className="modal-title mt-2" id="modal-title-default">
                                Meeting request
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
                                            {userType === "mentor"
                                            ? "Mentee"
                                            : activeReq.meetingType === "group-meeting"
                                                ? "Mentor"
                                                : "Expert"}
                                        </small>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <p>
                                        {activeReq.otherName}
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
                                        {activeReq.meetingName}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="4">
                                    <div className="text-left">
                                        <small className="text-uppercase text-muted font-weight-bold">
                                            Description 
                                        </small>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <p>
                                        {activeReq.meetingDescription}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="4">
                                    <div className="text-left mt-200">
                                        <small className="text-uppercase text-muted font-weight-bold">
                                            Start Time
                                        </small>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <div className="not-clickable">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-calendar-grid-58" />
                                            </InputGroupText>
                                            </InputGroupAddon>
                                            <ReactDatetime
                                            defaultValue={activeReq.meetingStart}
                                            timeFormat={true}
                                            onChange={e => e.preventDefault()}
                                            />
                                        </InputGroup>
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-2">
                                <Col lg="4">
                                    <div className="text-left">
                                        <small className="text-uppercase text-muted font-weight-bold">
                                            Duration 
                                        </small>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <p>
                                        {activeReq.meetingDuration}
                                    </p>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg="4">
                                    <div className="text-left">
                                        <small className="text-uppercase text-muted font-weight-bold">
                                            Place 
                                        </small>
                                    </div>
                                </Col>
                                <Col lg="8">
                                    <p>
                                        {activeReq.place}
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
                                {userType === "mentor"
                                ? <></>
                                : <Button 
                                color="danger" 
                                type="button"
                                onClick={() => handleRejectRequest(activeReq)}>
                                    Reject
                                </Button>
                                }
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

            </Card>
        </>
    );
}

export default MeetingRequestsPanel;