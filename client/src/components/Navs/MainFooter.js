/*!
Footer that should be displayed in all pages
*/
/*eslint-disable*/
import React, {useState} from "react";
import {
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Input
} from "reactstrap";

function MainFooter() {
  const [modal, toggleModal] = useState(false);

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
                    onClick={() => toggleModal(true)}
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

    <Modal
              className="modal-dialog-centered"
              isOpen={modal}
              toggle={() => toggleModal(false)}
            >
              <div className="modal-header">
                <h6 className="modal-title" id="modal-title-default">
                  Feedback
                </h6>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => toggleModal(false)}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                
              <textarea id="story" name="story"
              rows="5" cols="33">
              It was a dark and stormy night...
              </textarea>

              </div>
              <div className="modal-footer">
              <Button color="primary" type="button">
                  Submit
                </Button>
                <Button
                  className="ml-auto"
                  color="link"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => toggleModal(false)}
                >
                  Close
                </Button>
              </div>
            </Modal>
  </>
  );
}

export default MainFooter;