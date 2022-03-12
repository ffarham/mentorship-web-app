import React, { useState, useEffect } from "react";
import {
    Row, 
    Col, 
    Button,
    Modal, 
    Card,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    FormGroup
} from 'reactstrap';
import ReactDatetime from "react-datetime";
import moment from 'moment';

import Meeting from "./Meeting";
import api from "../../api/api";

function MeetingsPanel({ context, otherID }){

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userType = authState.userType;


    // alert pop ups
    // success
    const [successAlertPopup, setSuccessAlertPopup] = useState(false);
    // failure
    const [failureAlertPopup, setFailureAlertPopup] = useState(false);
    // message to be displayed
    const [alertBody, setAlertBody] = useState("");


    // store users meetings
    const [meetings, setMeetings] = useState([]);


    // keep track of active meeting
    const [activeMeeting, setActiveMeeting] = useState([]);
    const [meetingPopup, setMeetingPopup] = useState(false);
    const handleMeetingClick = (meeting) => {
        setActiveMeeting(meeting);
        setMeetingPopup(true);
    }


    // if a mentee cancels a meeting meeting or leaves a group meeting/workshop
    // or if a mentor cancels a group meeting or workshop
    const handleMeetingCancel = async (meetingID, meetingType) => {
        api.post(`/api/v1/cancelMeeting/${meetingID}/${meetingType}`).then(
            (res) => {
                // Notify user of success by setting alert message and activating pop up
                if(userType === "mentor"){
                    if(meetingType === "group-meeting"){setAlertBody("Group meeting has been successfully cancelled");}
                    if(meetingType === "workshop"){setAlertBody("Workshop has been successfully cancelled");}
                }else{
                    if(meetingType === "meeting"){setAlertBody("Meeting has successfully been cancelled");}
                    else if(meetingType === "group-meeting"){setAlertBody("You are no longer attending the group meeting");}
                    else{setAlertBody("You are no longer attending the workshop");}
                }
                setMeetingPopup(false);
                setSuccessAlertPopup(true);
            }
        );
    }
    // if a mentor reschedules a meeting
    const [reschedulePopup, setReschedulePopup] = useState(false);
    const [rescheduleMsg, setRescheduleMsg] = useState("");
    const handleMeetingReschedule = async (meetingID) => {
        const data = {rescheduleMessage: rescheduleMsg};
        // char limit 900
        api.post(`/api/v1/rescheduleMeeting/${meetingID}`, data).then(
            (res) => {
                // Notify user of success
                setReschedulePopup(false);
                setMeetingPopup(false);
                setAlertBody("The reschedule request has successfully been submitted");
                setSuccessAlertPopup(true);
            }
        );
    }


    // mentor has the option to mark meeting as complete
    const handleMarkMeetingComplete = (meetingID, meetingType) => {
        api.post(`/api/v1/markMeetingComplete/${meetingID}/${meetingType}`).then(
            (res) => {
                setAlertBody("The meeting has successfully been marked as complete");
                setMeetingPopup(false);
                setSuccessAlertPopup(true);
            }
        );
    }

    // mentee has the option to update meeting if mentor requests to reschedule the meeting
    const [updateMeeting, setUpdateMeeting] = useState(false);
    const [dateTime, setDateTime] = useState("");
    const handleMeetingUpdate = async (meetingID) => {
        // set dateTime to initial value if not changed
        const data = {meetingStart: dateTime === "" ? activeMeeting.meetingStart : moment(dateTime).format("DD/MM/YY hh:mm A")};
        api.post(`/api/v1/meetingUpdate/${meetingID}`, data).then(
            (res) => {
                // notify user
                setAlertBody("You have successfully updated the meeting");
                setUpdateMeeting(false);
                setMeetingPopup(false);
                setSuccessAlertPopup(true);
            }
        );
    };

    
    // both mentors and mentees have the option to create meetings
    const [createMeetingPopup, setCreateMeetingPopup] = useState(false);
    const [creatingMeetingType, setCreatingMeetingType] = useState("");
    const [mentors, setMentors] = useState([]);
    const [mentor, setMentor] = useState("");
    // handle mentor pick
    const handleMentor = (event) => {
        setMentor(event.target.value);
    }
    const [meetingName, setMeetingName] = useState("");
    const [meetingDescription, setMeetingDescription] = useState("");
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState("");
    const [location, setLocation] = useState("");
    // mentee creating a meeting
    const handleCreateMeeting = () => {
        api.get("/api/v1/mentorship").then(
            (res) => {
                setMentors(res.data);
            }
        );
        setCreatingMeetingType("meeting");
        setCreateMeetingPopup(true);
    };
    // mentor creating a group meeting
    const handleCreateGroupMeeting = () => {
        setCreatingMeetingType("group-meeting");
        setCreateMeetingPopup(true);
    };
    // mentor creating a workshop
    const [specialties, setSpecialties] = useState([]);
    const handleTopic = (event) => {
        setMeetingName(event.target.value);   
    }
    const handleCreateWorkshop = () => {
        // set mentors specialties 
        api.get("/api/v1/mentor/specialties").then(
            (res) => {
                setSpecialties(res.data);
            }
        );
        setCreatingMeetingType("workshop");
        setCreateMeetingPopup(true);
    };
    // handle meeting submit
    const handleCreateMeetingSubmit = async () => {
        const data = {
            meetingType: creatingMeetingType,
            mentorID: mentor,
            meetingName: meetingName,
            meetingDescription: meetingDescription,
            meetingStart: startTime,
            meetingDuration: duration,
            place: location,
            requestMessage: "", 
            description: "",
        };
        api.post("/api/v1/createMeeting", data).then(
            (res) => {
                setCreateMeetingPopup(false);
                setAlertBody("You have successfully created a meeting.");
                setSuccessAlertPopup(true);
            }
        );
    }

    // users can submit feedback once a meeting is complete
    const [submitFeedbackPopup, setSubmitFeedbackPopup] = useState(false);
    const [feedback, setFeedback] = useState("");
    const handleSubmitFeedback = () => {
        setSubmitFeedbackPopup(true);
    }
    const handleFeedbackSubmit = async (meetingID) => {
        const data = {
            meetingID: meetingID,
            feedback: feedback,
        };
        api.post("/api/v1/submitFeedback", data).then(
            (res) => {
                setMeetingPopup(false);
                setSubmitFeedbackPopup(false);
                setAlertBody("Feedback has successfully been submitted.");
                setSuccessAlertPopup(true);
            }
        );
    }

    // users can view feedback
    const [viewFeedback, setViewFeedback] = useState([]);
    const [viewFeedbackPopup, setViewFeedbackPopup] = useState(false);
    // array of jsons {feedback}
    const handleViewFeedback = (meetingID, meetingType) => {
        if(meetingType === "meeting"){
            api.get(`/api/v1/feedback/view/meeting/${meetingID}`).then(
                (res) => {
                    setViewFeedback(res.data);
                    setViewFeedbackPopup(true);
                }
            );
        }
    }


    // get the users meetings depending on the context
    useEffect(() => {
        // if the panel is in the meetings page
        if (context === "meetings"){
            api.get("/api/v1/meetings/meetings").then(
                (res) => {
                    if(res.status === 500){
                        // handle error
                        // TODO: display error in panel

                    }else if (res.status === 200){
                        // on success
                        setMeetings(res.data);
                    }else{
                        console.log("API error on res from /api/v1/meetings/meetings: ");
                        console.log(res.status);
                    }
                }
            );
        }
        // if the panel is in plans-of-action, only show meetings with the other user
        else if(context === "mentorship"){
            api.get(`/api/v1/meetings/mentorship/${otherID}`).then(
                (res) => {
                    if(res.status === 500){
                        // handle error
                        // TODO: display error in panel

                    }else if (res.status === 200){
                        // on success
                        setMeetings(res.data);
                    }else{
                        console.log("API error on res from /api/v1/meetings/mentorship: ");
                        console.log(res.status);
                    }
                }
            );
        }else if(context === "home"){
            api.get("/api/v1/meetings").then(
                (res) => {
                    if(res.status === 500){
                        // handle error
                        // TODO: display error in panel

                    }else if (res.status === 200){
                        // on success
                        setMeetings(res.data);
                    }else{
                        console.log("API error on res from /api/v1/meetings: ");
                        console.log(res.status);
                    }
                }
            );
        }else{
            console.log("no context matched");
        }
    }, []);

    return(
        <>
            <Card className="bg-secondary shadow border-0">
                <Row>
                    {context === "meetings"
                    ? <Col>
                        <div className="ml-4 mt-4">
                            <h4 className="display-4 mb-0">Meetings</h4>
                        </div>
                    </Col>
                    : <Col >
                        <div className=" text-center  ml-4 mt-4">
                            <h4 className="display-4 mb-0">Meetings</h4>
                        </div>
                    </Col>
                    }
                    {context === "meetings"
                    && <>{userType === "mentee"
                        ?  <Col>
                        <Row className="float-right">
                            <div className="mr-5 mt-4">
                                <Button color="primary" type="button" onClick={handleCreateMeeting}>
                                    Create a meeting
                                </Button>
                            </div>
                        </Row>
                    </Col>
                    : <>
                         <Col>
                           <Row className="float-right">
                               <div className="mr-5 mt-4">
                                   <Button color="primary" type="button" onClick={handleCreateGroupMeeting}>
                                       Create a group meeting
                                   </Button>
                               </div>
                           </Row>
                           <Row className="float-right">
                               <div className="mr-5 mt-2">
                                   <Button color="primary" type="button" onClick={handleCreateWorkshop}>
                                       Create a workshop
                                   </Button>
                               </div>
                           </Row>
                       </Col>
                    </>
                    }</>

                    }                  
                </Row>
                <div className="mx-4">
                    <hr/>
                </div>
                {meetings.length === 0
                ? <div className="ml-4">
                    <p>You have no meetings.</p>
                </div>
                : <div className="scrollView">

                    {meetings.map( (meeting) => {
                        return(
                            <div onClick={() => handleMeetingClick(meeting)}>
                                <Meeting data={meeting} from="mentorship"/>
                            </div>
                        );
                    })}
                </div>}
                
                {/* meeting popup */}
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
                        <Row className="justify-content-center">
                            {updateMeeting 
                            ? <p className="text-info mb-3">{activeMeeting.rescheduleMessage}</p>
                            : <>{userType === "mentee" && activeMeeting.confirmed === "reschedule" && !updateMeeting
                            && <p className="text-info mb-3">Mentor has requested a meeting reschedule</p>
                            }</>}
                        </Row>
                        {userType === "mentor" && activeMeeting === "meeting"
                        ? <Row>
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
                                {updateMeeting
                                ? <p className="text-muted">{userType === "mentor" ? activeMeeting.mentee : activeMeeting.mentor}</p>
                                : <p>{userType === "mentor" ? activeMeeting.mentee : activeMeeting.mentor}</p>}
                            </Col>
                        </Row>
                        : <></>}
                        <Row>
                            <Col lg="4">
                                <div className="text-left">
                                    <small className="text-uppercase text-muted font-weight-bold">
                                        Name
                                    </small>
                                </div>
                            </Col>
                            <Col lg="8">
                                {updateMeeting
                                ? <p className="text-muted">{activeMeeting.meetingName}</p>
                                : <p>{activeMeeting.meetingName}</p>}
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
                                {updateMeeting
                                ? <p className="text-muted">{activeMeeting.description}</p>
                                : <p>{activeMeeting.description}</p>}
                            </Col>
                        </Row>
                        <Row className="mb-2">
                            <Col lg="4">
                                <div className="text-left mt-1">
                                    {updateMeeting 
                                    ? <small className="text-uppercase text-info  font-weight-bold">Start</small>
                                    : <small className="text-uppercase text-muted font-weight-bold">Start</small>}
                                </div>
                            </Col>
                            <Col lg="8">
                                {updateMeeting && userType === "mentee" && activeMeeting.type === "meeting"
                                ? <div><InputGroup>
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-calendar-grid-58" />
                                </InputGroupText>
                                </InputGroupAddon>
                                <ReactDatetime
                                defaultValue={activeMeeting.meetingStart}
                                timeFormat={true}
                                onChange={(value) => setDateTime(value)}
                                />
                            </InputGroup></div>
                                : <div className="not-clickable">

                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <ReactDatetime
                                    defaultValue={activeMeeting.meetingStart}
                                    timeFormat={true}
                                    onChange={(value) => setDateTime(value)}
                                    />
                                </InputGroup>
                                </div>}
                            </Col>
                        </Row>
                        <Row>
                            <Col lg="4">
                                <div className="text-left">
                                    <small className="text-uppercase text-muted font-weight-bold">
                                        Duration 
                                    </small>
                                </div>
                            </Col>
                            <Col lg="8">
                                <p>
                                    {activeMeeting.duration}
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
                        {(activeMeeting.type === "workshop" || (activeMeeting.type === "group-meeting" && userType === "mentor"))
                        && <Row>
                            <Col lg="4">
                                <div className="text-left">
                                    <small className="text-uppercase text-muted font-weight-bold">
                                        Attending 
                                    </small>
                                </div>
                            </Col>
                            <Col lg="8">
                                <p>
                                    {activeMeeting.confirmed} {' '} out of {' '} {activeMeeting.total}
                                </p>
                            </Col>
                        </Row>}
                    </div>

                    <div className="modal-footer">
                        {!activeMeeting.complete && activeMeeting.confirmed === "true" && userType === "mentor"
                            && <Button 
                            color="primary" 
                            type="button"
                            onClick={() => handleMarkMeetingComplete(activeMeeting.id, activeMeeting.type)}>
                            Mark Complete 
                        </Button> }
                        {activeMeeting.complete && !(userType === "mentor" && activeMeeting.type !== "meeting")
                            && <Button 
                            color="primary" 
                            type="button"
                            onClick={handleSubmitFeedback}>
                            Submit Feedback 
                        </Button> }
                        {userType === "mentee"
                        ? <>{updateMeeting
                            ? <Button 
                                    color="primary" 
                                    type="button"
                                    onClick={() => handleMeetingUpdate(activeMeeting.id)}>
                                    Save
                                </Button>
                            : <>
                                {!activeMeeting.complete 
                                && <>
                                        {activeMeeting.type === "meeting"
                                        ? <Button 
                                            color="danger" 
                                            type="button"
                                            onClick={() => handleMeetingCancel(activeMeeting.id, activeMeeting.type)}>
                                            Cancel 
                                        </Button> 
                                        : <Button 
                                            color="danger" 
                                            type="button"
                                            onClick={() => handleMeetingCancel(activeMeeting.id, activeMeeting.type)}>
                                            Leave
                                        </Button> }
                                        {activeMeeting.confirmed === "reschedule"
                                        && <Button 
                                            color="info" 
                                            type="button"
                                            onClick={() => setUpdateMeeting(true)}>
                                            Update
                                        </Button>
                                    }</>
                                }</>
                            }</>
                        : <>
                        {!activeMeeting.complete 
                                && <>
                        {activeMeeting.type === "meeting" 
                        ? <Button 
                            color="warning" 
                            type="button"
                            onClick={() => setReschedulePopup(true)}>
                            Reschedule
                        </Button> 
                        : <>
                            <Button 
                            color="danger" 
                            type="button"
                            onClick={() => handleMeetingCancel(activeMeeting.id, activeMeeting.type)}>
                            Cancel
                        </Button> 
                        </>}
                        </>}
                        </>}
                        {activeMeeting.complete && activeMeeting.confirmed === "true" && userType === "mentor"
                            && <Button 
                            color="primary" 
                            type="button"
                            onClick={() => handleViewFeedback(activeMeeting.id, activeMeeting.type)}>
                            View Feedback
                        </Button> }
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

                {/* failure alert popup */}
                <Modal
                    className="modal-dialog-centered"
                    isOpen={failureAlertPopup}
                    toggle={() => setFailureAlertPopup(false)}
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
                        onClick={() => setFailureAlertPopup(false)}
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
                        onClick={() => setFailureAlertPopup(false)}
                        >
                        Close
                        </Button>
                    </div>
                </Modal>

                {/* reschedule popup */}
                <Modal
                className="modal-dialog-centered"
                isOpen={reschedulePopup}
                toggle={() => setReschedulePopup(false)}
                >
                    <div className="modal-header">
                        <h6 className="modal-title mt-2 " id="modal-title-default">
                            Rescheduling Meeting
                        </h6>
                        <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setReschedulePopup(false)}
                        >
                        <span aria-hidden={true}>×</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <Col>
                        <Row className="mx-2">
                            <p>Inform mentee of times you are free</p>
                        </Row>
                        <Row>
                            <Col>
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <Input 
                                        placeholder="Enter rescheduling notes" 
                                        type="textarea" 
                                        onChange={ (event) => {
                                            setRescheduleMsg(event.target.value);
                                        }}
                                        />
                                </InputGroup>
                            </FormGroup>
                            </Col>
                        </Row>
                        </Col>
                    </div>

                    <div className="modal-footer">
                        <Button 
                            color="primary" 
                            type="button"
                            onClick={() => handleMeetingReschedule(activeMeeting.id)}>
                            Submit
                        </Button> 
                        <Button
                        className="ml-auto"
                        color="link"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setReschedulePopup(false)}
                        >
                        Close
                        </Button>
                    </div>
                </Modal>

                {/* create meeting popup */}
                <Modal
                className="modal-dialog-centered"
                isOpen={createMeetingPopup}
                toggle={() => setCreateMeetingPopup(false)}
                >
                    <div className="modal-header">
                        <h6 className="modal-title mt-2 " id="modal-title-default">
                            Creating a Meeting
                        </h6>
                        <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setCreateMeetingPopup(false)}
                        >
                        <span aria-hidden={true}>×</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {creatingMeetingType === "meeting"
                        && <> <Row>
                        <Col sm="4" >
                              <small className="text-uppercase text-muted font-weight-bold">
                                  Mentor
                              </small>
                          </Col>
                          <Col sm="8">
                              <select onChange={handleMentor}>
                                  <option className="text-muted" disable >
                                          Please select a mentor
                                  </option>
                                  {mentors.map( (value) => {
                                      return(
                                          <option value={value.id}>{value.name}</option>
                                      );
                                  })}
                              </select>
                          </Col>
                      </Row>
                        <hr/>
                        </>
                      }
                        <Row>
                            <Col sm="4" className="mt-1">
                                {creatingMeetingType === "workshop"
                                ? <small className="text-uppercase text-muted font-weight-bold">
                                    Topic
                                </small>
                                : <small className="text-uppercase text-muted font-weight-bold">
                                    Name
                                </small>
                            }
                                
                            </Col>
                            <Col sm="8">
                                {creatingMeetingType === "group-meeting"
                                ? <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <Input 
                                            placeholder="Enter meeting name" 
                                            type="text" 
                                            onChange={ (event) => {
                                                setMeetingName(event.target.value);
                                            }}
                                            />
                                    </InputGroup>
                                </FormGroup>
                                : <>
                                     <select onChange={handleTopic}>
                                        <option className="text-muted" disable >
                                                Select the workshop's topic
                                        </option>
                                        {specialties.map( (value) => {
                                            return(
                                                <option value={value}>{value}</option>
                                            );
                                        })}
                                    </select>                           
                                </>}
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col sm="4" className="mt-1">
                                <small className="text-uppercase text-muted font-weight-bold">
                                    Description
                                </small>
                            </Col>
                            <Col sm="8">
                                <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <Input 
                                            placeholder="Enter meeting description" 
                                            type="textarea" 
                                            onChange={ (event) => {
                                                setMeetingDescription(event.target.value);
                                            }}
                                            />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr />
                        <Row>
                            <Col sm="4" className="mt-1">
                                <small className="text-uppercase text-muted font-weight-bold">
                                    Start time
                                </small>
                            </Col>
                            <Col sm="8">
                            <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-calendar-grid-58" />
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <ReactDatetime
                                    defaultValue={activeMeeting.meetingStart}
                                    timeFormat={true}
                                    onChange={(value) => setStartTime(value)}
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col sm="4" className="mt-1">
                                <small className="text-uppercase text-muted font-weight-bold">
                                    Duration
                                </small>
                            </Col>
                            <Col sm="8">
                                <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <Input 
                                            placeholder="Enter duration" 
                                            type="text" 
                                            onChange={ (event) => {
                                                setDuration(event.target.value);
                                            }}
                                            />
                                    </InputGroup>
                                </FormGroup>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col sm="4" className="mt-1">
                                <small className="text-uppercase text-muted font-weight-bold">
                                    Location
                                </small>
                            </Col>
                            <Col sm="8">
                                <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <Input 
                                            placeholder="Enter location" 
                                            type="text" 
                                            onChange={ (event) => {
                                                setLocation(event.target.value);
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
                            onClick={() => handleCreateMeetingSubmit()}>
                            Submit
                        </Button> 
                        <Button
                        className="ml-auto"
                        color="link"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setCreateMeetingPopup(false)}
                        >
                        Close
                        </Button>
                    </div>
                </Modal>

                {/* feedback popup */}
                <Modal
                className="modal-dialog-centered"
                isOpen={submitFeedbackPopup}
                toggle={() => setSubmitFeedbackPopup(false)}
                >
                    <div className="modal-header">
                        <h6 className="modal-title mt-2" id="modal-title-default">
                            Submit Feedback
                        </h6>
                        <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setSubmitFeedbackPopup(false)}
                        >
                        <span aria-hidden={true}>×</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">
                                <Input 
                                    placeholder="Enter feedback" 
                                    type="textarea" 
                                    onChange={ (event) => {
                                        setFeedback(event.target.value);
                                    }}
                                    />
                            </InputGroup>
                        </FormGroup>
                    </div>

                    <div className="modal-footer">
                        <Button 
                            color="primary" 
                            type="button"
                            onClick={() => handleFeedbackSubmit(activeMeeting.id)}>
                            Submit
                        </Button> 
                        <Button
                        className="ml-auto"
                        color="link"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setSubmitFeedbackPopup(false)}
                        >
                        Close
                        </Button>
                    </div>
                </Modal>

                  {/* view feedback popup */}
                  <Modal
                className="modal-dialog-centered"
                isOpen={viewFeedbackPopup}
                toggle={() => setViewFeedbackPopup(false)}
                >
                    <div className="modal-header">
                        <h6 className="modal-title mt-2" id="modal-title-default">
                            Feedback
                        </h6>
                        <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setViewFeedbackPopup(false)}
                        >
                        <span aria-hidden={true}>×</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {viewFeedback.length === 0
                        ? <>
                        <p>You have not received any feedback yet.</p>
                        </>
                        : <> {viewFeedback.map((value) => {
                            return(
                                <p>{value.feedback}</p>
                            );   
                        })}
                        </>
                        }
                       
                    </div>

                    <div className="modal-footer">
                        <Button
                        className="ml-auto"
                        color="link"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setViewFeedbackPopup(false)}
                        >
                        Close
                        </Button>
                    </div>
                </Modal>
            </Card>
        </>
    );
}

export default MeetingsPanel;