import React from "react";
import {
    Row,
    Col,
    Button
} from "reactstrap";

import api from "../../api/api";

function MileStone({ data }) {

    // get user information
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userType = authState.userType;

    // function to handle mark milestone as complete requests
    const markComplete = () =>{
        api.post(`/api/v1/markMilestoneComplete/${data.milestoneID}`,).then(
            (res) => {

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
        </>
    );
}

export default MileStone;