import React from "react";
import { useHistory } from 'react-router-dom';

import { 
    Container, 
    Row, 
    Col, 
    Button
} from "reactstrap";

import MainNavbar from "../components/Navs/MainNavbar.js";
import MainFooter from "../components/Navs/MainFooter.js";
import MeetingsPanel from "../components/MeetingsPanel.js";
import MeetingRequestsPanel from "../components/MeetingRequestsPanel.js";
import Modals from "../components/Modals"
import ModalsView from "../components/ModalsView"
import FeedbackPage from "./FeedbackPage.js";
// import Feedback from "../components/Feedback.js";

function MeetingsPage(){
    const history = useHistory();
    // const authState = JSON.parse(localStorage.getItem("authState"));
    // const userType = authState.userType;
    const userType = "mentor";



// function f1() {
//     // feedback.map( (fb) => 
//     // <FeedbackPage data={fb} />
//     <FeedbackPage />
//     // );

// }

{/* {meetings.map((meeting) => <Meeting data={meeting} />)}  */}

    return(
        <>
  
            {/* <MainNavbar /> */}
            <div className="btn-wrapper text-center">
                <h1>Meetings Page</h1>
            </div>
            
            <Container fluid="xl" className="m-5">
                <Row>
                    <Col sm="12" md="8">
                        <MeetingsPanel />
                    </Col>
                    <Col sm="12" md="4">
                        <MeetingRequestsPanel />

                        {userType === "mentor" 
                            ? 
                            <>
                        <Row>
                         
                            <Col sm="4" xs="6">
                                {/* {feedback.map( (fb) => ( */}
                                    {/* <ModalsView styling="popReq" name="View Feedback" title="Feedback:" info={fb.text}/> */}
                                    <Button 
                                    onClick=
                                    {() => {
                                        history.push("/feedback");
                                    }}
                                    className="popReq"
                                    color="primary"
                                    >
                                    View Feedback
                                    </Button>
                                           {/* {meetings.map((meeting) => <Meeting data={meeting} />)}  */}
                            </Col>
                            
                            <Col sm="4" xs="6">
                                <Modals styling="popReq" name="Schedule a Group Meeting" />
                            </Col>

                            <Col sm="4">
                                <Modals styling="popReq" name="Schedule a Workshop "/>
                            </Col>
                        </Row>
                            </>
                            :
                            <>
                            <Row>
                                <Col xs="6">
                                    {/* {feedback.map( (fb) => ( */}
                                        {/* <ModalsView styling="popReq" name="View Feedback" title="Feedback:" info={fb.text}/> */}
                                    <Button 
                                        onClick=
                                        {() => {
                                            history.push("/feedback");
                                        }}
                                        className="popReq"
                                        color="primary"
                                    >
                                    View Feedback
                                    </Button>
                                    {/* ))} */}
                                </Col>
                                
                                <Col xs="6">
                                    <Modals styling="popReq" name="Schedule a Meeting" />
                                </Col>
                            </Row>

                            </>
                           
                        }
                    </Col>

                    {/* <Col md="8"> */}

                        {/* </Col> */}
                </Row>
                
            </Container>
            <MainFooter /> 
        
        </>
    );
}


export default MeetingsPage;