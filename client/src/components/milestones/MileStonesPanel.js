import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    Col,
    Row,
    Input,
    InputGroup,
    FormGroup
} from 'reactstrap';
import MileStone from "./MileStone";
import api from "../../api/api";

function MileStonesPanel({ data, completed, poaID }) {

    // get user information
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userType = authState.userType;

    // alert pop ups
    const [successAlertPopup, setSuccessAlertPopup] = useState(false);
    const [alertBody, setAlertBody] = useState("");

    // mentor can create a milestone for a mentee
    const [milestoneName, setMilestoneName] = useState("");
    const [milestoneDescription, setMilestoneDescription] = useState("");
    const [createMilestone, setCreateMilestone] = useState(false);
    const handleCreateMilestone = (poaID) => {
        const data = {
            milestoneName: milestoneName, 
            milestoneDescription: milestoneDescription
        };
        api.post(`/api/v1/createMilestone/${poaID}`, data).then(
            (res) => {
                setAlertBody("Milestone has successfully been created.");
                setCreateMilestone(false);
                setSuccessAlertPopup(true);
            }
        );
    };

    return (
        <>
            <div className="text-center ">
                <small className="text-uppercase text-muted font-weight-bold">
                    Milestones 
                </small>
            </div>
            {data.length === 0 
            ? <p>There are no assigned milestones!</p>
            : data.map( (milestone) => {
                return(
                    <div>
                        <hr/>
                        <MileStone data={milestone} />
                    </div>
                );
            })
            }
            {userType === "mentor" && !completed
            ? <div>
                    <hr/>
                    <div className="float-right">
                        <Button 
                            className="btn-1"
                            color="primary" 
                            outline 
                            type="button"
                            onClick={() => setCreateMilestone(true)}>
                        Create Milestone
                        </Button>
                    </div>
                </div>
            : <></>
            }
             {/* create milestone popup */}
            <Modal 
                className="modal-dialog-centered"
                isOpen={createMilestone}
                toggle={() => setCreateMilestone(false)}
                >
                <div className="modal-header">
                    <h6 className="modal-title mt-2" id="modal-title-default">
                    Create a Milestone
                    </h6>
                    <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setCreateMilestone(false)}
                    >
                    <span aria-hidden={true}>×</span>
                    </button>
                </div>

                <div className="modal-body">
                    <Row className="mb-2">
                        <Col lg="4">
                            <div className="mt-2">
                                <small className="text-uppercase text-muted font-weight-bold">
                                    Name
                                </small>
                            </div>
                        </Col>
                        <Col lg="8">
                            <Input
                            className="form-control-alternative"
                            placeholder="Enter milestone name"
                            type="text"
                            onChange={ (event) => {
                                setMilestoneName(event.target.value);
                            }}/>
                        </Col>
                    </Row>        
                    <Row>
                        <Col lg="4">
                            <small className="text-uppercase text-muted font-weight-bold">
                                Description
                            </small>
                        </Col>
                        <Col lg="8">
                            <FormGroup className="mb-3">
                                <InputGroup className="input-group-alternative">
                                    <Input 
                                        placeholder="Enter milestone description" 
                                        type="textarea" 
                                        onChange={ (event) => {
                                            setMilestoneDescription(event.target.value);
                                        }}
                                        />
                                </InputGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                </div>

                <div className="modal-footer">
                    <Button 
                        color="primary" 
                        type="button"
                        onClick={() => handleCreateMilestone(poaID)}> 
                        Submit
                    </Button> 
                    <Button
                    className="ml-auto"
                    color="link"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setCreateMilestone(false)}
                    >
                    Close
                    </Button>
                </div>
            </Modal>

            {/* success alert popup */}
            <Modal
              className="modal-dialog-centered"
              isOpen={successAlertPopup}
              toggle={() => setSuccessAlertPopup(false)}
              >
              <div className="modal-header">
                  <h6 className="modal-title mt-2 text-success" id="modal-title-default">
                      Success
                  </h6>
                  <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => setSuccessAlertPopup(false)}
                  >
                  <span aria-hidden={true}>×</span>
                  </button>
              </div>

              <div className="modal-body">
                  <p>{alertBody}</p>
              </div>

              <div className="modal-footer">
                  <Button
                  className="ml-auto"
                  color="link"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => setSuccessAlertPopup(false)}
                  >
                  Close
                  </Button>
              </div>
          </Modal>
        </>
    );
}

export default MileStonesPanel;