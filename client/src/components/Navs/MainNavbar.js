import React from "react";
import { Link, useHistory, Redirect } from "react-router-dom";

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
            // attempt to log user out
            // get user id
            const userID = JSON.parse(localStorage.getItem('authState')).userID;
            const data = {'userID': userID}

            // on success, it should automatically redirect the user as authState will no longer exist
            const res = await AuthServices.logout(data);
            
            // redirect user to the landing page
            window.location.href ="/login";

        } catch(error){
            console.log(error);
        }
    }
    
    return(
        <>
            {/* Navbar primary */}
            <Navbar className="navbar-dark bg-primary mt-4" expand="lg">
                <Container>
                <NavbarBrand href="#pablo" onClick={() => {history.push("/home")}}>
                    Logo
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
                            src={require("assets/img/brand/argon-react.png")}
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
                        {activeView === "home" ? <span className="text-info">Home</span> : <span>Home</span>}
                        </NavLink>
                    </NavItem>
                    {/* only display plans of actions to mentees */}
                    {userType === "mentee" &&
                        <NavItem>
                        <NavLink href="" onClick={() => history.push("/plan-of-action")}>
                        {activeView === "plan-of-action" ? <span className="text-info">Plans of Actions</span> : <span>Plans of Actions</span>}
                        </NavLink>
                    </NavItem>
                    }
                    <NavItem>
                        <NavLink href="" onClick={() => {history.push("/meetings")}}>
                        {activeView === "meetings" ? <span className="text-info">Meetings</span> : <span>Meetings</span>}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="" onClick={() => {history.push("/mentorship")}}>
                        Mentorship
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="" onClick={() => {history.push("/settings")}}>Settings</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href=""  onClick={handleLogout}>
                            <span className="text-danger">Logout</span>
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