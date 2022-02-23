import React from "react";
import { useState, useEffect } from "react";

import {
    Card,
    Row,
    Col
} from "reactstrap";

// function Meeting( {meeting} ){

    // const {id, name, time, location, duration, description} = meeting;

//     return(
//         <>
//             <Card>
//                 <Row>
//                     <p>{name}</p>
//                     <p>{time}</p>
//                     {/* <p>{location}</p>
//                     <p>{duration}</p>
//                     <p>{description}</p> */}
//                 </Row>
//             </Card>
//         </>
//     );
// }
const meetingRequests = [
        {
            id: 1,
            name: 'Meeting w/ Jamie',
            time: '21:00',
            location: 'Library',
            duration: '1h30',
            description: 'text1',
        },
        {
            id: 2,
            name: 'Meeting w/ George',
            time: '11:00',
            location: 'FAB',
            duration: '2h30',
            description: 'text2',
        }
]

function MeetingRequest(){
    // const {id, name, time, location, duration, description} = meeting;
    return(
        <>
        {meetingRequests.map( (meetingReq) => (
            <Card body color="dark" outline>
                <Row>
                    <Col>
                    {/* <Card className="meeting" key={meeting.id} color="dark" outline> */}
                        <h3>
                            {meetingReq.name}:
                        </h3>
                        <Row>
                            <Col><big><b>Time:</b> {meetingReq.time} </big></Col>
                            <Col><big><b>Location:</b> {meetingReq.location} </big></Col>
                            <Col><big><b>Duration:</b> {meetingReq.duration}</big></Col>
                            <Col><big><b>Description:</b> {meetingReq.description}</big></Col>
                        </Row>
                    {/* </Card> */}
                    </Col>
                </Row>
            </Card>
            ))}
        </>
    );
}

export default MeetingRequest;