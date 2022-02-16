import React, { useState, useEffect } from "react";
import {
    Card
} from 'reactstrap';

import api from "../api/api";
import Meeting from "./Meeting";

function MeetingsPanel() {

    // store of meetings
    const [meetings, setMeetings] = useState([]);   // meetings = []

    // runs when the Panel is initially mounted
    useEffect( () => {
        // api request to get all meetings
        api
            .get("/api")
            .then( (res) => {
                if(res.data.meetings){
                    // updates the list of meetings in the meetings state
                    setMeetings(res.data.meetings);
                }
            });

    }, []);
    

    return (
        <>         
            <Card className="bg-secondary shadow border-0 px-2 py-5">
                {meetings.map((meeting) => <Meeting data={meeting} />)} 
            </Card>
        </>  
    );
}

export default MeetingsPanel;