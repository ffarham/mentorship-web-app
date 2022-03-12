import React from 'react';
import {
    Col,
    Row,
    Card
} from 'reactstrap';

function MeetingRequest({ request }){
    return(
        <>
        <Card className="bg-secondary shadow border-0 my-2  p-2 ">
                <Row className="my-2">
                    <Col className="" sm="10">
                        {request.meetingType === "workshop"
                        ? <p>{request.meetingName}</p>
                        : <p>{request.otherName}</p>}
                    </Col>
                    <Col className="" sm="2">
                        <Row className="float-right mr-2">
                            {request.meetingType === "meeting"
                            ? <p className="text-info mb-0">M</p>
                            : request.meetingType === "group-meeting"
                                ? <p className="text-info mb-0">GM</p>
                                : <p className="text-info mb-0">WS</p>}
                        </Row>
                    </Col>
                </Row>
            </Card>
        </>
    );
}

export default MeetingRequest;