import React from 'react';
import {
    Row,
    Col,
    Card
} from 'reactstrap';

function Meeting({ data, from }) {

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userID = authState.userID;
    const userType = authState.userType;

    return(
        <>
            <div className="py-2 pb-3" >
                <Card className="bg-secondary shadow border-0 px-4 py-4">
                    <Row className="justify-content-center">
                        {from === "mentorship"
                        ? <>
                            <Col className="" lg="6">
                                <div className="mt-4">
                                    <p>{data.meetingName}</p>
                                </div>
                            </Col>
                            <Col className="text-lg-right align-self-lg-center" lg="6">
                                {data.attended === true
                                ? <>
                                    <div>
                                        <p className="text-success mb-0">Attended</p>
                                    </div>
                                </>
                                : <>
                                    <div>
                                        <p className="text-warning mb-0">Upcoming</p>
                                    </div>
                                </>}
                            </Col>
                        </>
                        : <>
                            {/* <Col>
                                <div className="mt-4">
                                    {userType === "mentor"
                                    ? <p>{data.mentee}</p>
                                    : <p>{data.mentor}</p>
                                    }
                                </div>
                            </Col> */}
                        </>
                        }
                       
                    </Row>
                </Card>        
            </div>
        </>
    );
}

export default Meeting;
