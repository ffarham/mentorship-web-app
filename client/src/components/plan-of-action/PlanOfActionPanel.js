import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Modal,
} from 'reactstrap';

import api from "../../api/api";
import PlanOfAction from "./PlanOfAction";
import MileStonesPanel from "../milestones/MileStonesPanel";

function PlanOfActionPanel({ context, otherID }) {

    // get user information
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userID = authState.userID;
    const userType = authState.userType;

    // alert pop ups
    const [successAlertPopup, setSuccessAlertPopup] = useState(false);
    const [alertBody, setAlertBody] = useState("");

    const [planOfActions, setPlanOfActions] = useState([]);
    // get all of user's plans of actions
    useEffect(() => {
      if(context === "plan-of-action"){
        api.get("/api/v1/plan-of-actions").then(
          (res) => {
            setPlanOfActions(res.data);
          }        
          );
        }else if(context === "mentorship"){
        console.log("getting POAs in mentorship");
        console.log(otherID);
        api.get(`/api/v1/mentorship/plan-of-actions/${otherID}`).then(
          (res) => {
            console.log(res.data);
            setPlanOfActions(res.data);
          }
        );
      }else{

      }
    }, []);

    const [activePoA, setActivePoA] = useState({});
    const [popUp, setPopUp] = useState(false);

    const handlePlanOfActionClick = (planOfAction) => {
        setActivePoA(planOfAction);
        setPopUp(true);
    };

    const markComplete = () => {
        api.post(`/api/v1/markPOAcomplete/${activePoA.id}`).then(
            (res) => {
                setPopUp(false);
                setAlertBody("Plan of action successfully marked as complete");
                setSuccessAlertPopup(true);
            }
        );
    }


    return (
        <> 
            <Card className="bg-secondary shadow border-0">
                <div className="text-center mt-4">
                    <h4 className="display-4 mb-0">Plan of Actions</h4>
                </div>
                <div className="mx-4">
                    <hr/>
                </div>
                {planOfActions.length === 0
                    ? <div className="ml-4">
                        <p>Empty</p>
                    </div>
                    : <div className="scrollView">
                        {planOfActions.map( (planOfAction) => {
                            return(
                                <div onClick={() => handlePlanOfActionClick(planOfAction)}>
                                    <PlanOfAction data={planOfAction} from="mentorship"/>
                                </div>
                            );
                        })}
                    </div>}
              </Card>
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
                <MileStonesPanel data={activePoA.milestones} completed={activePoA.completed} poaID={activePoA.id} />            
              </div>

              <div className="modal-footer">
                  {userType === "mentee" 
                  ? <></>
                  : <>{!activePoA.completed &&
                  <Button 
                        color="primary" 
                        type="button"
                        onClick={markComplete}>
                        Mark as Complete
                    </Button> 
                  }</>
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

export default PlanOfActionPanel;