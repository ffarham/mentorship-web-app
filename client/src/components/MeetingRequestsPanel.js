import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardTitle,
    CardText
} from 'reactstrap';

import api from "../api/api";
import MeetingRequest from "./MeetingRequest";

 function MeetingRequestsPanel() {
    // store of meetings Requests
    const [meetingRequest, setMeetingRequest] = useState([]);   // meetings = []

    // //runs when the Panel is initially mounted
    // useEffect( () => {
    //     // api request to get all meeting Requests
    //     api
    //         .get("/api/meetingRequests")
    //         .then( (res) => {
    //             if(res.data.meetingRequest){
    //                 // updates the list of meeting Requests in the meetings state
    //                 setMeetingRequest(res.data.meetingRequest);
    //             }
    //         });

    // }, []);

    return (
        <>        
            <Card className="bg-secondary shadow border-0 px-2 py-5 text-center">
                <CardBody>
                    <CardTitle tag="h5" >
                        <div className="btn-wrapper text-center">
                                <h2>Meeting Requests</h2>
                        </div>
                    </CardTitle>
                    <CardText>
                        <div className="scrolling">
                        <MeetingRequest/>
                        </div>
                         {/* {meetings.map((meeting) => <Meeting data={meeting} />)}  */}
                    </CardText>
                </CardBody>               
            </Card>
        </>  
    );
    
}

export default MeetingRequestsPanel;