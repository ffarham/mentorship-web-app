/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

// Argon pages
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
import MentorsMenteesPage from "views/MentorsMenteesPage.js"; 
import PlanOfActionsPage from "views/PlanOfActionsPage.js";
import SettingsPage from "views/SettingsPage.js";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* argon routes */}
      <Route path="/argon" exact render={props => <Index {...props} />} />
      <Route path="/landing-page" exact render={props => <Landing {...props} />} />
      <Route path="/login-page" exact render={props => <Login {...props} />} />
      <Route path="/profile-page" exact render={props => <Profile {...props} />} />
      <Route path="/register-page" exact render={props => <Register {...props} />} />

      {/* Routes */}
      <Route path="/" exact render={props => <LandingPage {...props} />} />
      <Route path="/login" exact render={props => <LoginPage {...props} />} />
      <Route path="/register" exact render={props => <RegisterPage {...props} />} />
      <Route path="/home" exact render={props => <HomePage {...props} />} />
      <Route path="/meetings" exact render={props => <MeetingsPage {...props} />} />
      <Route path="/mentors-mentees" exact render={props => <MentorsMenteesPage {...props} />} />
      <Route path="/plan-of-action" exact render={props => <PlanOfActionsPage {...props} />} />
      <Route path="/settings" exact render={props => <SettingsPage {...props} />} />


      {/* Redirect unknown URL to the landing page */}
      <Redirect to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
