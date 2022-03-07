import React from "react";
import { useState, useEffect } from "react";

import {
    Card,
    Row,
    Col,
    Button,
    UncontrolledPopover,
    PopoverHeader,
    PopoverBody
} from "reactstrap";

import Modals from "./Modals"
import ModalsView from "./ModalsView"
import ModalsTester from "./ModalsTester";
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
            description: 'Vivamus felis lorem, laoreet ac blandit at, volutpat vitae massa. Cras congue orci sit amet placerat blandit. Curabitur mollis gravida dolor, sed auctor arcu pharetra in. Vivamus magna diam, lobortis quis elit a, mattis rutrum diam. Fusce imperdiet magna quam, a vestibulum justo blandit sed.',
        },
        {
            id: 2,
            name: 'Meeting w/ George',
            time: '11:00',
            location: 'FAB',
            duration: '2h30',
            description: 'Nulla faucibus convallis magna, sit amet pellentesque magna feugiat vitae. Donec venenatis egestas rhoncus. Curabitur consectetur vel tortor vitae placerat. Morbi non ornare turpis. In convallis quam est, sed laoreet nulla rhoncus eu. Proin aliquam nisl ut vehicula tincidunt.',
        }
]

function MeetingRequest(){
    // const {id, name, time, location, duration, description} = meeting;
    const userType = "mentor";
    return(
        <>
        {meetingRequests.map( (meetingReq) => (
            // <Card body color="dark" outline>
            //     <Row>
            //         <Col>
            //             <h3>
            //                 {meetingReq.name}:
            //             </h3>
            //             <Row>
            //                 <Col><big><b>Time:</b> {meetingReq.time} </big></Col>
            //                 <Col><big><b>Location:</b> {meetingReq.location} </big></Col>
            //                 <Col><big><b>Duration:</b> {meetingReq.duration}</big></Col>

                           // {/* Accept or Reschedule options for Meeting requests */}
                           <>
                           <Col>
                            <ModalsTester {...meetingReq} title="Meeting Description" info={meetingReq.description} />
                           </Col>
                            {/* <Col>
                                <ModalsView name="Description" info={meetingReq.description} title="Description of meeting:" />
                            </Col> */}
                            <Col>
                                <Row className="xs-2"> 
                                    <ModalsView name="Accept" info="Thank you for accepting the meeting" title="The meeting is now accepted!"/>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userType === "mentor"
                                    ?
                                    <Modals name="Reschedule" />
                                    :
                                    <ModalsView name="Reject" info="The meeting request has been rejected" title="Rejected!" />
                                    }
                                    
                                </Row>
                            </Col>
                            <br></br>
                           </>
            //             </Row>
            //         </Col>
            //     </Row>
            // </Card>
            ))}
        </>
    );
}

export default MeetingRequest;