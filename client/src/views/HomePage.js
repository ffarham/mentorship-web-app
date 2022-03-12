import React, { useState, useEffect } from 'react';
import { 
    Container,
    Row, 
    Col, 
    // Card 
} from "reactstrap";

import TokenService from 'api/tokenService.js';

import { Redirect } from 'react-router-dom';

import MainNavbar from "../components/Navs/MainNavbar.js";
import MainFooter from "../components/Navs/MainFooter.js";
import MeetingsPanel from "../components/meetings/MeetingsPanel.js";
import NotificationsPanel from "../components/home/NotificationsPanel.js";

function HomePage() {

    // TokenService.removeLocalRefreshToken();
    // TokenService.removeLocalAccessToken();
    // localStorage.removeItem('authState');

    return(
        <>
            <MainNavbar />
            <Container fluid="xl" className="m-5">
                <Row>
                    <Col sm="12" md="8">
                        <MeetingsPanel context={"home"} />
                    </Col>
                    <Col sm="12" md="4">
                        <NotificationsPanel />
                    </Col>
                </Row>
            </Container>

            <MainFooter />
        </>
    );
}

export default HomePage;