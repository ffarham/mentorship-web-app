import React, { useState } from "react";
import {
    Row,
    Col,
    Button,
    Modal
} from "reactstrap";

import api from "../../api/api";

function MileStone({ data }) {

    // get user information
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userType = authState.userType;

    // alert pop ups
    const [successAlertPopup, setSuccessAlertPopup] = useState(false);
    const [alertBody, setAlertBody] = useState("");

    // function to handle mark milestone as complete requests
    const markComplete = () =>{
        api.post(`/api/v1/markMilestoneComplete/${data.milestoneID}`,).then(
            (res) => {
                setAlertBody("The milestone has successfully been marked as complete");
                setSuccessAlertPopup(true);
            }
        );
    }

    return(
        <>
            <div>
                <Row>
                    <Col className="" lg="3">
                    <small className="text-uppercase text-muted font-weight-bold">
                        {data.milestoneName}                        
                    </small>
                    </Col>
                    <Col lg="9">
                        <p>{data.milestoneDescription}</p>
                    </Col>
                    
                </Row>
                <Row>
                    <Col className="float-left">
                        {userType === "mentee" || data.completed
                        ? <></>
                        :  <Button
                        className="text-primary"
                        color="link"
                        href="#pablo"
                        onClick={markComplete}
                      >
                        Mark as complete
                      </Button>
                        }
                    </Col>
                    <Col>
                        <div className="float-right mt-2">
                            {data.completed 
                                ? <small className="text-success"> Completed</small>
                                : <small className="text-warning">Ongoing</small>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
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

export default MileStone;