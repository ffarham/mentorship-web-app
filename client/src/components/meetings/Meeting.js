import React from 'react';
import {
    Row,
    Col,
    Card
} from 'reactstrap';

function Meeting({ data }) {

    console.log("meeting");
    console.log(data);

    return(
        <>
            <div className="py-2 pb-3" >
                <Card className="bg-secondary shadow border-0 px-4 py-4">
                    <Row className="justify-content-center">
                            <Col className="" lg="6">
                                <div className="mt-4">
                                    <p>{data.meetingName}</p>
                                </div>
                            </Col>
                            <Col className="text-lg-right align-self-lg-center" lg="6">
                                {data.status === "finished"
                                ? <>
                                    <div>
                                        <p className="text-success mb-0">Attended</p>
                                    </div>
                                </>
                                : data.status === "reschedule"
                                    ? <>
                                        <div>
                                            <p className="text-info mb-0">Reschedule</p>
                                        </div>
                                    </>
                                    : data.status === "ongoing"
                                        ?<>
                                        <div>
                                            <p className="text-warning mb-0">Upcoming</p>
                                        </div>
                                        </>
                                        : <>
                                            <p className="text-warning mb-0">pending</p>
                                        </>}
                            </Col>
                       
                    </Row>
                </Card>        
            </div>
        </>
    );
}

export default Meeting;
