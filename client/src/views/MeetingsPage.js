import React, { useContext } from "react";
import { 
    Container, 
    Row, 
    Col, 
} from "reactstrap";

import { UserContext } from "../helpers/UserContext";

import MainNavbar from "../components/Navs/MainNavbar.js";
import MainFooter from "../components/Navs/MainFooter.js";
import MeetingsPanel from "../components/MeetingsPanel.js";
import MeetingRequestsPanel from "../components/MeetingRequestsPanel.js";
import Modals from "../components/Modals"
import ModalsView from "../components/ModalsView"

function MeetingsPage(){

    const { userState } = useContext(UserContext);
    const feedback = [
        // {
        //     id: 1,
        //     text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus feugiat tortor nec elit molestie accumsan. Donec interdum ante ut ex sagittis, at porttitor augue molestie. Integer eget pulvinar arcu. Vestibulum sit amet sagittis orci. Nulla aliquet risus ex, sit amet sollicitudin erat pellentesque et. Suspendisse vitae sem nec eros cursus congue ac in odio. Praesent dapibus quis magna eget placerat. Ut quis ipsum a massa auctor tincidunt id a dolor. Quisque dignissim magna a ornare lacinia. Nunc elementum, nulla vel tristique tincidunt, purus orci laoreet ipsum, sed facilisis nulla nibh eu massa. Ut sed diam euismod, gravida massa ut, bibendum dolor. Quisque id lorem cursus, pellentesque ligula eu, faucibus erat.'
        // },
        {
            id: 2,
            text: 'Phasellus condimentum sapien lectus, sed commodo tellus gravida ac. Proin pellentesque pulvinar massa, ac gravida orci eleifend tempus. Morbi maximus lorem eu elementum pellentesque. In quis elit ac nisl ultrices ultrices in eu lorem. Fusce quis tempor elit. Ut non sapien quis dolor fringilla tempor id ut enim'
        }
]

    return(
        <>
  
            <MainNavbar />
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

                        {userState.userType === "mentor" 
                            ? 
                            <>
                        <Row>
                         
                            <Col sm="4" xs="6">
                                {feedback.map( (fb) => (
                                    <ModalsView styling="popReq" name="View Feedback" title="Feedback:" info={fb.text}/>
                                ))}
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
                                    {feedback.map( (fb) => (
                                        <ModalsView styling="popReq" name="View Feedback" title="Feedback:" info={fb.text}/>
                                    ))}
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