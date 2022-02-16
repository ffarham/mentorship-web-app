import React, { useContext } from "react";
import { 
    Container, 
    Row, 
    Col, 
    Button
} from "reactstrap";

import { UserContext } from "../helpers/UserContext";

import MainNavbar from "../components/Navs/MainNavbar.js";
import MainFooter from "../components/Navs/MainFooter.js";
import MeetingsPanel from "../components/MeetingsPanel.js";
import MeetingRequestsPanel from "../components/MeetingRequestsPanel.js";

function MeetingsPage(){

    const { userState } = useContext(UserContext);

    return(
        <>
            <MainNavbar />
            <h1>meetings page</h1>
            <Container fluid="xl" className="m-5">
                <Row>
                    <Col sm="12" md="8">
                        <MeetingsPanel />
                    </Col>
                    <Col sm="12" md="4">
                        <MeetingRequestsPanel />
                        {userState.userType === "mentor" 
                            ? <>
                                <Button>Schedule a group meeting</Button>
                                <Button>Schedule a workshop</Button>
                            </>
                            :
                            <Button>Scedule a meeting</Button>
                        }
                    </Col>
                </Row>
            </Container>
            <MainFooter /> 
        </>
    );
}


export default MeetingsPage;