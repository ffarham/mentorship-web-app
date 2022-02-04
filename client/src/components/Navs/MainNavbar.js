import React from "react";
import { Link } from "react-router-dom";

// reactstrap components
import {
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";

class MainNavbar extends React.Component {
    render(){
        return(
            <>
                {/* Navbar primary */}
                <Navbar className="navbar-dark bg-primary mt-4" expand="lg">
                    <Container>
                    <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
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
                            <NavLink href="#pablo" onClick={e => e.preventDefault()}>
                            Home <span className="sr-only">(current)</span>
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#pablo" onClick={e => e.preventDefault()}>
                            Plans of Actions?
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#pablo" onClick={e => e.preventDefault()}>
                            Meetings
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#pablo" onClick={e => e.preventDefault()}>
                            Mentors/Mentees?
                            </NavLink>
                        </NavItem>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav>Settings</DropdownToggle>
                            <DropdownMenu
                            aria-labelledby="navbar-primary_dropdown_1"
                            right
                            >
                            <DropdownItem
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                            >
                                Action
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                            >
                                Another action
                            </DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem
                                href="#pablo"
                                onClick={e => e.preventDefault()}
                            >
                                Something else here
                            </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        </Nav>
                    </UncontrolledCollapse>
                    </Container>
                </Navbar>
            </>
        );
    }
}

export default MainNavbar;