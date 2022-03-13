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
  Modal
} from "reactstrap";
import api from "../../api/api";

function MainFooter() {
  const [modal, toggleModal] = useState(false);
  const [TAC, toggleTAC] = useState(false);

  const userID = 1;

      const submitFeedback = () => { 

        const data = {rating: 3, feedback: document.getElementById("textbox").value};
        api.post(`/api/v1/feedback`, data).then(
            (res) => {
                
            }
      );
      toggleModal(false);
  }

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
                Group 38
                .
              </div>
            </Col>
            <Col md="6">
              <Nav className=" nav-footer justify-content-end">
                <NavItem>
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
                    onClick={() => toggleTAC(true)}
                  >
                    Terms and Conditions
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

                <p>Please let us know any feedback that you have:</p>
                
                <textarea id="textbox" className="feedbackmodal">
            
                </textarea>

              </div>
              <div className="modal-footer">
              <Button color="primary" type="button" onClick={() => submitFeedback()}>
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

            <Modal
              className="modal-dialog-centered"
              isOpen={TAC}
              toggle={() => toggleTAC(false)}
              >
              <div className="modal-header">
                  <h6 className="modal-title mt-2 " id="modal-title-default">
                      Terms & Conditions
                  </h6>
                  <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => toggleTAC(false)}
                  >
                  <span aria-hidden={true}>×</span>
                  </button>
              </div>

              <div className="modal-body">
                <>
                <h1>Terms of Service</h1>
                Updated on 10/03/2022
                <br/>

                Welcome to Discipulo. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Discipulo's relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please stop using Discipulo. 

                The term 'Discipulo' or 'us' or 'we' refers to the owner of the Dicispulo website. 

                The term 'you' refers to the user or viewer of our website.

                The use of this website is subject to the following terms of use:


                <ol>
                  <li>The content of the pages of this website is for your general information and use only. It is subject to change without notice.
                  Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
                  <li>Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.</li>
                  <li>This website contains material which is owned by or licensed to us. All material under the website falls under the MIT License. This material includes, but is not limited to, design language, design layout, appearance, images, logos and other such graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
                  <li>All trademarks reproduced in this website, which are not the property of, or licensed to the operator, are acknowledged on the website.</li>
                  <li>Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence. Offences include but are not limited to storing criminal information on our servers through feedback forms, hatespeech or the posting of illicit links.</li>
                  <li>From time to time, this website may also include links to other websites. This is since users may submit links as part of their feedback or plans of action, which are not moderated. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).</li>
                  <li>Your use of this website and any dispute arising out of such use of the website is subject to the laws of England, Northern Ireland, Scotland and Wales. </li>
                </ol>

                <h1>Privacy Policy</h1>
                Updated on 10/03/2022
                <ol>
                  <li><h3>Type of personal information we collect</h3></li>

                  Personal identifiers and contact information.
                  <li><h3>How we get your personal information and why we have it</h3>

                  All of the personal information we process is provided to us directly by you for one of the following reasons:
                  <ul>
                      <li>We request for your email address, in order to ensure you are a valid employee of the given company, and to ensure every user is unique.</li>
                      <li>We request for your name and other personal identifiers so that users are able to identify other uses so that in-person mentoring can follow onto the Discipulo system.</li>
                      <li>We request for business areas and subjects of interest in order to facilitate intelligent matching between mentees and mentors.</li>
                  </ul></li>
                  

                  <li><h3>We do not recieve your personal information from any other external sources.</h3></li>
                  <li><h3>We will not share your personal information with any other external organisations or individuals.</h3></li>

                  <li><h3>How we store your personal information</h3>

                  We ensure all personal data is stored securely. Discipulo is secure against attacks and security measures will be maintained and updated regularly. Account deactivation of an account leads to an immediate and permenant deletion of user data on Discipulo's servers.</li>

                  <li><h3>General Data Protection Act (GDPR)</h3>

                  Under the GDPR, the lawful bases we rely on for processing this information are:
                  <ul>
                      <li>Your consent. You are able to remove your consent at any time. You can do this by contacting contact@discipulo.com.</li>
                      <li>We have a contractual obligation.</li>
                      <li>We have a vital interest.</li>
                      <li>We have a legitimate interest.</li>
                  </ul></li>


                  <li><h3>Your data protection rights</h3>

                  Under data protection law, you have rights including:
                  <ul>
                      <li>Your right of access - You have the right to ask us for copies of your personal information.</li>
                      <li>Your right to rectification - You have the right to ask us to rectify personal information you think is inaccurate. You also have the right to ask us to complete information you think is incomplete.</li>
                      <li>Your right to erasure - You have the right to ask us to erase your personal information in certain circumstances.</li>
                      <li>Your right to restriction of processing - You have the right to ask us to restrict the processing of your personal information in certain circumstances.</li>
                      <li>Your right to object to processing - You have the the right to object to the processing of your personal information in certain circumstances.</li>
                      <li>Your right to data portability - You have the right to ask that we transfer the personal information you gave us to another organisation, or to you, in certain circumstances.</li>
                  </ul>

                  You are not required to pay any charge for exercising your rights. If you make a request, we have one month to respond to you. Please contact us at [insert email address, phone number and or postal address] if you wish to make a request.

                  <h3>How to contact us</h3>

                  If you have any concerns about our use of your personal information, you can make a complaint to us at contact@discipulo.com.</li>
                </ol>
                </>

              </div>

              <div className="modal-footer">
                  <Button
                  className="ml-auto"
                  color="link"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => toggleTAC(false)}
                  >
                  Close
                  </Button>
              </div>
    </Modal>
  </>
  );
}

export default MainFooter;