/*!
Footer that should be displayed in all pages
*/
/*eslint-disable*/
import React from "react";
import {
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

class MainFooter extends React.Component {
  render() {
    return (
      <>
      <div className="footer-wrapper ">
        <footer className="footer mt-5">
          <Container>
            <hr />
            <Row className=" align-items-center justify-content-md-between">
              <Col md="6">
                <div className=" copyright">
                  © {new Date().getFullYear()}{" "}
                  Group 38 initt
                  .
                </div>
              </Col>
              <Col md="6">
                <Nav className=" nav-footer justify-content-end">
                  <NavItem>
                    <NavLink
                      // href=""
                      target="_blank"
                      >
                      About Us
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      // href=""
                      target="_blank"
                    >
                      Feedback Form
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      // href=""
                      target="_blank"
                    >
                      MIT License
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </>
    );
  }
}

export default MainFooter;