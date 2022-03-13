import React from "react";
import { Link, useHistory } from "react-router-dom";

// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

import AuthServices from "../../api/authService";

function MainNavbar({ activeView }) {

    let history = useHistory();

    // get user type logged in
    const userType = JSON.parse(localStorage.getItem('authState')).userType;
    
    // logout handler function
    const handleLogout = async () => {
        try{
            // on success, it should automatically redirect the user as authState will no longer exist
            await AuthServices.logout;
            
            // redirect user to the landing page
            history.push("/");

        } catch(error){
            console.log(error);
        }
    }
    
    return(
        <>
            {/* Navbar primary */}
            <Navbar className="navbar-dark bg-secondary mt-4" expand="lg">
                <Container>
                <NavbarBrand href="#pablo" onClick={() => {history.push("/home")}}>
                <Link to="/">
                            <img
                            alt="..."
                            src={require("assets/img/LandingPage/Logo/text_logo_2_colour.png")}
                            />
                        </Link>
                </NavbarBrand>
                <button className="navbar-toggler" id="navbar-primary">
                    <span className="navbar-toggler-icon" />
                </button>
                <UncontrolledCollapse navbar toggler="#navbar-primary">
                    <div className="navbar-collapse-header">
                    <Row>
                        <Col className="collapse-brand" xs="6">
                        <Link to="/">
                            <img
                            alt="..."
                            src={require("assets/img/LandingPage/Logo/text_logo_2_colour.png")}
                            />
                        </Link>
                        </Col>
                        <Col className="collapse-close" xs="6">
                        <button className="navbar-toggler" id="navbar-primary">
                            <span />
                            <span />
                        </button>
                        </Col>
                    </Row>
                    </div>

                    <Nav className="ml-lg-auto" navbar>
                    <NavItem>
                        <NavLink href="" onClick={() => {history.push("/home")}}>
                            {activeView === "home" ? <h6 style={{ fontFamily: "Proxima-Nova-Black" }} className="text-info">HOME</h6> : <h6 style={{ fontFamily: "Proxima-Nova-Black" }}>HOME</h6>}
                        </NavLink>
                    </NavItem>
                    {/* only display PLANS OF ACTIONs to mentees */}
                    {userType === "mentee" &&
                        <NavItem>
                            <NavLink href="" onClick={() => history.push("/plan-of-action")}>
                                {activeView === "plan-of-action" ? <h6 style={{ fontFamily: "Proxima-Nova-Black" }} className="text-info">PLANS OF ACTION</h6> : <h6 style={{ fontFamily: "Proxima-Nova-Black" }} className="mb-0">PLANS OF ACTION</h6>}
                            </NavLink>
                        </NavItem>
                    }
                    <NavItem>
                        <NavLink href="" onClick={() => {history.push("/MEETINGS")}}>
                        {activeView === "meetings" ? <h6 style={{ fontFamily: "Proxima-Nova-Black" }} className="text-info">MEETINGS</h6> : <h6 style={{ fontFamily: "Proxima-Nova-Black" }}>MEETINGS</h6>}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="" onClick={() => {history.push("/mentorship")}}>
                            {activeView === "mentorship" ? <h6 style={{ fontFamily: "Proxima-Nova-Black" }} className="text-info">MENTORSHIP</h6> : <h6 style={{ fontFamily: "Proxima-Nova-Black" }}>MENTORSHIP</h6>}
                        </NavLink>
                    </NavItem>
                    
                    <NavItem>
                        <NavLink href="" onClick={() => {history.push("/settings")}}>
                            {activeView === "settings" ? <h6 style={{ fontFamily: "Proxima-Nova-Black" }} className="text-info">SETTINGS</h6> : <h6 style={{ fontFamily: "Proxima-Nova-Black" }}>SETTINGS</h6>}
                        </NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink href=""  onClick={handleLogout}>
                            <h6 style={{ fontFamily: "Proxima-Nova-Black" }} className="text-danger">LOGOUT</h6>
                        </NavLink>
                    </NavItem>
                    </Nav>
                </UncontrolledCollapse>
                </Container>
            </Navbar>
        </>
    );
}

export default MainNavbar;