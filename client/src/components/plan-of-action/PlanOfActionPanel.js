import React, { useState, useEffect } from 'react';
import {
    Container,
    Button,
    Modal
} from 'reactstrap';

import api from "../../api/api";
import PlanOfAction from "./PlanOfAction";
import MileStonesPanel from "../milestones/MileStonesPanel";

function PlanOfActionPanel() {

    // get user information
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userID = authState.userID;
    const userType = authState.userType;

    const [planOfActions, setPlanOfActions] = useState([]);
    // get all of user's plans of actions
    useEffect(() => {
        const url = `/api/v1/plan-of-actions/${userID}`;
        api.get(url).then(
            (res) => {
                if(res.data){
                    setPlanOfActions(res.data);
                }
            },
            // runs when response status falls out of 2xx
            (error) => {
                console.log(error);
            }
        );
    }, []);

    const [activePoA, setActivePoA] = useState({});
    const [popUp, setPopUp] = useState(false);

    const handleClick = (planOfAction) => {
        setActivePoA(planOfAction);
        setPopUp(true);
    };

    const markComplete = () => {
        api.post(`/api/v1/markPOAcomplete/${activePoA.id}`).then(
            (res) => {
                
            }
        );
    }


    return (
        <> 
            <Container fluid="xl" className="mx-9">
                {planOfActions.map( (planOfAction) => {
                    return (
                        <div onClick={() => handleClick(planOfAction)}>
                            <PlanOfAction data={planOfAction} />
                        </div>
                    );
                }
                
            )}
            <Modal
              className="modal-dialog-centered"
              isOpen={popUp}
              toggle={() => setPopUp(false)}
            >
              <div className="modal-header">
                <h6 className="modal-title" id="modal-title-default">
                  {activePoA.planName}
                </h6>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => setPopUp(false)}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>

              <div className="modal-body">
                <p>
                    {activePoA.planDescription}
                </p>
                <MileStonesPanel data={activePoA.milestones}/>            
              </div>

              <div className="modal-footer">
                  {userType === "mentee" 
                  ? <></>
                  : <Button 
                        color="primary" 
                        type="button"
                        onClick={markComplete}>
                        Mark as Complete
                    </Button> 
                  }
                <Button
                  className="ml-auto"
                  color="link"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => setPopUp(false)}
                >
                  Close
                </Button>
              </div>
            </Modal>
            </Container>
        </>
    );
}

export default PlanOfActionPanel;