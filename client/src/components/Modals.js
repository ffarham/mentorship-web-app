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
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  Row,
  Col
} from "reactstrap";

class Modals extends React.Component {
  state = {};
  toggleModal = state => {
    this.setState({
      [state]: !this.state[state]
    });
  };
  
render(){
    return (
      <>
        <Row>
          <Col>
            <Button
            className={`btn ${this.props.styling ? 
              'popReq' : 'pop'}`} 
              block
              // color="success"
              color={this.props.name === 'Reschedule' ? 'warning' : 'primary'}
              // color={if ($(this.props.styling) === "Reschedule") ? color: 'red'}
              // color={`${this.props.name === 'Reschedule' ? 'red' : 'default'}`}
              type="button"
              onClick={() => this.toggleModal("formModal")}
            >
              {this.props.name}
            </Button>
            <Modal
              className="modal-dialog-centered"
              size="sm"
              isOpen={this.state.formModal}
              toggle={() => this.toggleModal("formModal")}
            >
              <div className="modal-body p-0">
                <Card className="bg-secondary shadow border-0">
                  <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <big>{this.props.name}</big>
                    </div>
                    <Form role="form">
                      <FormGroup
                        className={classnames("mb-3", {
                          focused: this.state.nameFocused
                        })}
                      >
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Name of Meeting"
                            type="name"
                            onFocus={e => this.setState({ nameFocused: true })}
                            onBlur={e => this.setState({ nameFocused: false })}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup
                        className={classnames("mb-3", {
                          focused: this.state.timeFocused
                        })}
                      >
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Time"
                            type="time"
                            onFocus={e => this.setState({ timeFocused: true })}
                            onBlur={e => this.setState({ timeFocused: false })}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup
                        className={classnames("mb-3", {
                          focused: this.state.locationFocused
                        })}
                      >
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Location"
                            type="location"
                            onFocus={e => this.setState({ locationFocused: true })}
                            onBlur={e => this.setState({ locationFocused: false })}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup
                        className={classnames("mb-3", {
                          focused: this.state.durationFocused
                        })}
                      >
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Duration"
                            type="duration"
                            onFocus={e => this.setState({ durationFocused: true })}
                            onBlur={e => this.setState({ durationFocused: false })}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup
                        className={classnames("mb-3", {
                          focused: this.state.descriptionFocused
                        })}
                      >
                        <InputGroup className="input-group-alternative">
                          <Input
                            placeholder="Description"
                            type="text"
                            onFocus={e => this.setState({ descriptionFocused: true })}
                            onBlur={e => this.setState({ descriptionFocused: false })}
                          />
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Button className="my-4" color="primary" type="button">
                          Submit
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Modal>
          </Col>
        </Row>
      </>
    );
  }
}

export default Modals;
