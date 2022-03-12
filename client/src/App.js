import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

// design system css
import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

// css
import "assets/css/mentorship.css";
import "assets/css/newCss.css";
import "assets/css/landingPage.css";
import "assets/scss/arrow.scss";

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
// import MentorMentee from "views/MentorMentee.js";
import PlanOfActionsPage from "views/PlanOfActionsPage.js";
import SettingsPage from "views/SettingsPage.js";
import FeedbackPage from "views/FeedbackPage.js";

function App() {
    
    return(
        <>
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


                    <Route path="/" exact render={props => <LandingPage {...props} />} />
                    <Route path="/login" exact render={props => <LoginPage {...props}  />} />
                    <Route path="/register" exact render={props => <RegisterPage {...props}  />} />

                    <Route path="/home" exact render={props => <HomePage {...props} />} />
                    <Route path="/plan-of-action" exact render={props => <PlanOfActionsPage {...props} />} />
                    <Route path="/meetings" exact render={props => <MeetingsPage {...props} />} />
                    <Route path="/mentorship" exact render={props => <MentorshipPage {...props} />} />
                    {/* <Route path="/mentor-mentee" exact render={props => <MentorMentee {...props} />} /> */}
                    <Route path="/settings" exact render={props => <SettingsPage {...props} />} />
                    <Route path="/feedback" exact render={props => <FeedbackPage {...props} />} />

                    <Redirect to="/" />
                </Switch>
            </Router>
        </>
    );
}

export default App;