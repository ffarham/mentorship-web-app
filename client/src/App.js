import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

// design system css
import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";


// Argon pages, use these pages as an example
import Index from "views/examples/Argon.js";
import Landing from "views/examples/Landing.js";
import Login from "views/examples/Login.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";

// Pages
import LoginPage from "views/LoginPage.js";
import LandingPage from "views/LandingPage.js";
import RegisterPage from "views/RegisterPage.js";
import HomePage from "views/HomePage.js";
import MeetingsPage from "views/MeetingsPage.js";
import MentorshipPage from "views/MentorshipPage.js"; 
import PlanOfActionsPage from "views/PlanOfActionsPage.js";
import SettingsPage from "views/SettingsPage.js";

// imports from helper directory
import {UserContext} from "./helpers/UserContext";

import api from "./api/api";

function App() {

    // initialise user state
    const [userState, setUserState] = useState({
        loggedIn: true,
        userType: "mentee",
        userID: 0,
        name: "",
        email: "",
        department: ""
    });

    const [meetings, setMeetings] = useState([
        {
        id: 1,
        text: 'Meeting with Mentor',
        date: '15th March at 2:30',
        },
        {
        id: 2,
        text: 'Hello',
        date: '17th December at 1:45',
        },
        {
            id: 3,
            text: 'Testing',
            date: '12th June at 9:30',
            },
    ])

    //checks if a array is emtpy
    function isEmtpy(meetings) {
        return Object.keys(meetings).length === 0;
    }

    // when app is initialized
    // check if a user is already logged in and initialise context appropriatly
    // useEffect(() => {
    //     api
    //         .get("", {
    //             headers: {
    //                 // value is null if item does not exist
    //                 accessToken: localStorage.getItem("accessToken")
    //             }
    //         })
    //         .then((res) => {
    //             if (res.data.error){
    //                 // if accessToken doesn't exist
    //                 // direct user to landing page: already done by default when app is loaded
    //                 // handle error: set user logged in state to false
    //                 setUserState( {...userState, loggedIn: false} );
    //             } else {
    //                 // if user is already logged in
    //                 // direct them to home page here????
    //                 // set user state to the returned user associated with the sent access token
    //                 setUserState({
    //                     loggedIn: true,
    //                     userID: res.data.userID,
    //                     name: res.data.name,
    //                     email: res.data.email,
    //                     department: res.data.department
    //                 });
    //             }
    //         });
    // }, []);
    
    return(
        <>
            <UserContext.Provider value={ { userState, setUserState} }>
                <Router>
                    <Switch>    
                        {/* argon routes */}
                        <Route path="/argon" exact render={props => <Index {...props} />} />
                        <Route path="/landing-page" exact render={props => <Landing {...props} />} />
                        <Route path="/login-page" exact render={props => <Login {...props} />} />
                        <Route path="/profile-page" exact render={props => <Profile {...props} />} />
                        <Route path="/register-page" exact render={props => <Register {...props} />} />

                        {/* Routes */}
                        {/* TODO: could direct unknown URL to PageNotFound page displaying 404 error */}

                        {/* only give access to the routes below if user is not logged in */}
                        {!userState.loggedIn && 
                            <>
                                <Route path="/" exact render={props => <LandingPage {...props} />} />
                                <Route path="/login" exact render={props => <LoginPage {...props} />} />
                                <Route path="/register" exact render={props => <RegisterPage {...props} />} />

                                {/* <Redirect to="/" /> */}
                            </>
                        }

                        {/* only give access to the routes below if user is logged in */}
                        {userState.loggedIn && 
                            <>
                                <Route path="/home" exact render={props => <HomePage {...props}/>} />
                                <Route path="/meetings" exact render={props => <MeetingsPage {...props} />} />
                                <Route path="/mentorship" exact render={props => <MentorshipPage {...props} />} />
                                <Route path="/plan-of-action" exact render={props => <PlanOfActionsPage {...props} />} />
                                <Route path="/settings" exact render={props => <SettingsPage {...props} />} />

                                {/* <Redirect to="/home" /> */}
                            </>
                        }

                    </Switch>
                </Router>
            </UserContext.Provider>
        </>
    );
}

export default App;