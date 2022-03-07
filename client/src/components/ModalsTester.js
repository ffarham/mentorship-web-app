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
// nodejs library that concatenates classes
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Modal,
  Row,
  Col
} from "reactstrap";


class ModalsTester extends React.Component {
  state = {};
  toggleModal = state => {
    this.setState({
      [state]: !this.state[state]
    });
  };
  render() {
    return (
      <>
      {/* {meetings.map( (meeting) => ( */}
        <Row>
          {/* <Col md="4"> */}
          <Col>
            <Button
              block
            //   className={`${this.props.styling ? 
            //     'popReq' : 'pop'}`}
              color="primary"
              type="button"
              onClick={() => this.toggleModal("defaultModal")}
            >    
            <i className="ni ni-calendar-grid-58"></i>           
            {this.props.name}: {this.props.time}--{this.props.location}--{this.props.duration}
              
              {/* {this.props.description} */}
            </Button>
            <Modal
              className="modal-dialog-centered"
              isOpen={this.state.defaultModal}
              toggle={() => this.toggleModal("defaultModal")}
            >
              <div className="modal-header">
                <h6 className="modal-title" id="modal-title-default">
                  {this.props.title}
                </h6>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal("defaultModal")}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  {this.props.info}
                </p>
              </div>
              <div className="modal-footer">
                <Button
                  className="ml-auto"
                  color="link"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => this.toggleModal("defaultModal")}
                >
                  Close
                </Button>
              </div>
            </Modal>
          </Col>
        </Row>
        {/* ))} */}
      </>
    );
  }
}

export default ModalsTester;
