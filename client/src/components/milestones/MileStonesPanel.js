import React from 'react';
import {
    Button
} from 'reactstrap';
import MileStone from "./MileStone";

function MileStonePanel({ data }) {

    // get user information
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userType = authState.userType;

    return (
        <>
            <div className="text-center ">
                <small className="text-uppercase text-muted font-weight-bold">
                    Milestones 
                </small>
            </div>
            {data.length === 0 
            ? <p>You have no assigned milestones!</p>
            : data.map( (milestone) => {
                return(
                    <div>
                        <hr/>
                        <MileStone data={milestone} />
                    </div>
                );
            })
            }
            {userType === "mentee"
            ? <></>
            :   <div>
                    <hr/>
                    <div className="float-right">
                        <Button 
                            className="btn-1"
                            color="primary" 
                            outline 
                            type="button"
                            onClick={e => e.preventDefault()}>
                        Create Milestone
                        </Button>
                    </div>
                </div>
            }
        </>
    );
}

export default MileStonePanel;