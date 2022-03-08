import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Progress
} from 'reactstrap';

function PlanOfAction({ data, from }) {

     // get user information
     const authState = JSON.parse(localStorage.getItem('authState'));
     const userType = authState.userType;

    const [progress, setProgress] = useState("0");
    const [colour, setColour] = useState("default");
    const [progressMsg, setProgressMsg] = useState("");

    // initialise the state of the progress
    useEffect(() => {
        if (data.completed){
            // if PoA is marked complete
            setProgress("100");
            setColour("success");
            setProgressMsg("Completed");
        }else{
            // if mentor has not assigned any milestones for the PoA
            const milestones = data.milestones;
            if(milestones.length === 0){
                setProgress("100");
                setColour("danger");
                setProgressMsg("To be assigned");                
            }else{
                // calculate the percentage of the completed PoA
                const total = milestones.length;
                let completed = 0;
                for(var i = 0; i < total; i++){
                    if(data.milestones[i].completed){
                        completed = completed + 1;
                    }
                }
                const percentage = (completed / total) * 100;

                // if all milestones are complete but the mentor has not marked the plan of action as complete
                if(percentage === 100){
                    setProgress("100");
                    setColour("info");
                    if(userType === "mentor"){
                        setProgressMsg("Need to review");
                    }else{
                        setProgressMsg("In review");
                    }
                }
                // if milestones are incomplete
                else{
                    setProgress(percentage.toString());
                    setColour("warning");
                    setProgressMsg("Ongoing");
                }
            }
        }
    }, []);

    return (
        <>
            <div className="py-2 pb-3" >
                <Card className="bg-secondary shadow border-0 px-4 py-4">
                    <Row className="justify-content-center">
                        {from === "planOfActionPanel"
                        ? <>
                        <Col lg="3">
                            <div className="mt-4">
                                {userType === "mentor"
                                ? <p>{data.mentee}</p>
                                : <p>{data.mentor}</p>
                                }
                            </div>
                        </Col>
                        <Col className="" lg="5">
                            <div className="mt-4">
                                <p>{data.planName}</p>
                            </div>
                        </Col>
                        <Col className="text-lg-right align-self-lg-center" lg="4">
                            <div className="progress-wrapper">
                                <div className="progress-info">
                                    <div className="progress-label">
                                        <small>{progressMsg}</small>
                                    </div>
                                <div className="progress-percentage">
                                </div>
                                </div>
                                <Progress max="100" value={progress} color={colour} />
                            </div>
                        </Col>
                        </>
                        : <>
                        <Col className="" lg="5">
                            <div className="mt-4">
                                <p>{data.planName}</p>
                            </div>
                        </Col>
                        <Col className="text-lg-right align-self-lg-center" lg="7">
                            <div className="progress-wrapper">
                                <div className="progress-info">
                                    <div className="progress-label">
                                        <small>{progressMsg}</small>
                                    </div>
                                <div className="progress-percentage">
                                </div>
                                </div>
                                <Progress max="100" value={progress} color={colour} />
                            </div>
                        </Col>
                        </>}
                    </Row>
                </Card>        
            </div>
        </>
    );
}

export default PlanOfAction;