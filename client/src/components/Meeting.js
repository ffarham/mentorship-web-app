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

//.........

// const [meetings, setMeetings] = useState([]);

// useEffect( () => {
//     const getMeetings = async () => {
//         const MeetingsFromServer = await fetchMeetings()
//         setMeetings(MeetingsFromServer)
//     }

//     getMeetings()
// }, [])

// // Fetch Meetings
// const fetchMeetings = async () => {
//     const res = await fetch('http://localhost:5000/meetings')
//     const data = await res.json()

//     return data;
// }
const meetings = [
        {
            id: 1,
            name: 'Meeting w/ Andrew',
            time: '21:00',
            location: 'Library',
            duration: '1h30',
            description: 'Library meeting will happen at the second floor',
        },
        {
            id: 2,
            name: 'Engineering Meeting',
            time: '11:00',
            location: 'FAB',
            duration: '2h30',
            description: 'eng: Lorem ipsum',
        },
        {
            id: 3,
            name: 'Workshop',
            time: '13:00',
            location: 'Grid',
            duration: '30 mins',
            description: 'This Worksop will take place at  ... ',
        },
        // {
        //     id: 3,
        //     name: 'Workshop',
        //     time: '13:00',
        //     location: 'Grid',
        //     duration: '30 mins',
        //     description: 'text3',
        // },
        // {
        //     id: 3,
        //     name: 'Workshop',
        //     time: '13:00',
        //     location: 'Grid',
        //     duration: '30 mins',
        //     description: 'text3',
        // }
]

function Meeting(){
    // const {id, name, time, location, duration, description} = meeting;
    return(
        <>
        {meetings.map( (meeting) => (
            // <Card key ={meeting.id} body color="dark" outline>
                // {/* <Row> */}
                    // {/* <Col> */}
                    // {/* <Card className="meeting" key={meeting.id} color="dark" outline> */}
                        // {/* <h3>
                            // {meeting.name}:
                        // </h3> */}
                        // <Row>
                        <Col>
                            <ModalsTester {...meeting} title="Meeting Description" info={meeting.description} />
                            <br></br>
                        </Col>
                        // {/* </Row> */}
                            // {/* <ModalsTester name={meeting.location} />
                            // <ModalsTester name={meeting.duration} />
                            // <ModalsTester name={meeting.description} /> */}
                            // {/* <Col><big><b>Time:</b> {meeting.time}</big></Col>
                            // <Col><big><b>Location:</b> {meeting.location}</big></Col>
                            // <Col><big><b>Duration:</b> {meeting.duration}</big></Col>
                            // <Col> <ButtonComp key={meeting.id} meeting={meeting.description} />  </Col>            */}
                        // </Row>
                    // {/* </Card> */}
                    // {/* </Col> */}
                // {/* </Row> */}
            // {/* </Card> */}
            ))}
        </>
    );
}

export default Meeting;