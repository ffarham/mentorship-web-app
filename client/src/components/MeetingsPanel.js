import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardTitle,
    CardText
} from 'reactstrap';

import api from "../api/api";
// import axios from 'axios'
import Meeting from "./Meeting";

 function MeetingsPanel() {
    // store of meetings
    const [meetings, setMeetings] = useState([]);   // meetings = []

    // //runs when the Panel is initially mounted
    // useEffect( () => {
    //     // api request to get all meetings
    //     api
    //         .get("/api/meeting")
    //         .then( (res) => {
    //             if(res.data.meetings){
    //                 // updates the list of meetings in the meetings state
    //                 setMeetings(res.data.meetings);
    //             }
    //         });

    // }, []);

    return (
        <>        
            <Card className="bg-secondary shadow border-0 px-2 py-5 text-center">
                <CardBody>
                    <CardTitle tag="h5" >
                        <div className="btn-wrapper text-center">
                                <h2>Meetings</h2>
                        </div>
                    </CardTitle>
                    <CardText>
                        <div className="scrolling">
                        <Meeting/>
                        </div>
                         {/* {meetings.map((meeting) => <Meeting data={meeting} />)}  */}
                    </CardText>
                </CardBody>               
            </Card>
        </>  
    );
    
}

export default MeetingsPanel;