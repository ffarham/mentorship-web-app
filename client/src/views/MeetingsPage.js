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
import MeetingsPanel from "../components/meetings/MeetingsPanel.js";
import MeetingRequestsPanel from "../components/meetings/MeetingRequestsPanel.js";

function MeetingsPage(){
    return(
        <>
            <MainNavbar activeView="meetings"/>
            <Container fluid="xl" className="m-5">
                <Row>
                    <Col sm="12" md="8">
                        <MeetingsPanel context={"meetings"} />
                    </Col>
                    <Col sm="12" md="4">
                        <MeetingRequestsPanel />
                    </Col>
                </Row>
            </Container>
            <MainFooter />
        </>
    );
}


export default MeetingsPage;