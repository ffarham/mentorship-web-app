import React from "react";
import { Container, Row, Col, Card } from "reactstrap";

import MainNavbar from "../components/Navs/MainNavbar.js";
import MainFooter from "../components/Navs/MainFooter.js";
import MeetingsPanel from "../components/MeetingsPanel.js";
import NotificationsPanel from "../components/NotificationsPanel.js";

class HomePage extends React.Component {
    render(){
        return(
            <>
                <MainNavbar />
                <Container fluid="xl" className="m-5">
                    <Row>
                        <Col sm="12" md="8">
                            <MeetingsPanel />
                        </Col>
                        <Col sm="12" md="4">
                            <NotificationsPanel />
                        </Col>
                    </Row>
                </Container>
                <div className="fixed-bottom">
                    <MainFooter />
                </div>
            </>
        );
    }
}

export default HomePage;