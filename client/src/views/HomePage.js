import React, { useState, useEffect } from 'react';
import { 
    Container,
    Row, 
    Col, 
    // Card 
} from "reactstrap";

import { Redirect } from 'react-router-dom';

import MainNavbar from "../components/Navs/MainNavbar.js";
import MainFooter from "../components/Navs/MainFooter.js";
import HomePanel from "../components/HomePanel.js";
import NotificationsPanel from "../components/NotificationsPanel.js";


function HomePage() {

    // check if a user is logged in or not, assume the user is already logged in so the use effect callback runs
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    // store user type
    const [userType, setUserType] = useState("");
    useEffect( () => {
        // if auth state exists then user is logged in
        const authState = localStorage.getItem('authState');
        if (!authState) {
            //setIsLoggedIn(false); Uncommnet later when auth tokens are working.
        }else{
            setUserType(JSON.parse(authState).userType);
        }
    }, []);

    // if user is not logged in, redirect user to landing page
    if (!isLoggedIn) {
        return <Redirect to="/" />
        // window.location.href = "/";
    }

    return(
        <>
            <Container fluid="xl" className="m-5">
                <Row>
                    <Col sm="12" md="8">
                        {/* <HomePanel /> */}
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

export default HomePage;