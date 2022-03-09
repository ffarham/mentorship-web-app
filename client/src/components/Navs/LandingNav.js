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

function LandingNav({ activeView }) {

    let history = useHistory();
     
    return(
        <>
            {/* Navbar primary */}
            <Navbar className="bar navbar-light mt-4" expand="lg">
                <Container>
                <NavbarBrand className="center">
                    <div className="img-container">
                        <img
                            alt="Discipulo Logo"
                            src={require("assets/img/LandingPage/Logo/text_logo.png")}
                        />
                    </div>
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
                            src={require("assets/img/LandingPage/Logo/text_logo.png")}
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
                        <NavLink href="" onClick={() => {history.push("/login")}}>
                        {activeView === "login" ? <span className="text-info">Login</span> : <span className="lgText">Login</span>}
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="" onClick={() => {history.push("/register")}}>
                        {activeView === "register" ? <span className="text-info">Register</span> : <span className="lgText">Register</span>}
                        </NavLink>
                    </NavItem>
                    </Nav>
                </UncontrolledCollapse>
                </Container>
            </Navbar>
        </>
    );
}

export default LandingNav;