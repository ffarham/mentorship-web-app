import React, { useState, useEffect } from 'react';
import {
    Row, 
    Col
} from 'reactstrap';
import { Redirect } from 'react-router-dom';

import MainNavbar from "../components/Navs/MainNavbar.js";
import MainFooter from "../components/Navs/MainFooter.js";
import PlanOfActionPanel from "../components/plan-of-action/PlanOfActionPanel.js";


function PlanOfActionsPage() {

    // check if a user is logged in or not, assume the user is already logged in so the use effect callback runs
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    // store user type
    const [userType, setUserType] = useState("");
    useEffect( () => {
        // if auth state exists then user is logged in
        const authState = localStorage.getItem('authState');
        if (!authState) {
            setIsLoggedIn(false);
        }else{
            setUserType(JSON.parse(authState).userType);
        }
    }, []);

    // if user is not logged in, redirect user to landing page
    if (!isLoggedIn) {
        return <Redirect to="/" />
        // window.location.href = "/";
    }else{
        // only mentees should have access to this page
        if (userType === "mentor"){
            return <Redirect to="/home" />
            // window.location.href = "/home";
        }
    }

    return (
        <>

            <MainNavbar activeView="plan-of-action"/>

            <Row>
                <Col lg="1"></Col>
                <Col className="mt-4" lg="10">
                    <PlanOfActionPanel context="plan-of-action" />
                </Col>
                <Col lg="1"></Col>
            </Row>

            <MainFooter />
        </>
    );

}

export default PlanOfActionsPage;