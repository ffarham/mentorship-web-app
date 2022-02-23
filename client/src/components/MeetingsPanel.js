import React, { useState, useEffect, useContext } from "react";
import {
    Card
} from 'reactstrap';



import api from "../api/api";
import Meeting from "./Meeting";
import { UserContext } from "../helpers/UserContext";

function MeetingsPanel(){

    const { userState } = useContext(UserContext);

    const [ meetings, setMeetings] = useState([]);

    useEffect(() => {
        const getMeetings = async () => {
          const Meegingsfromserver = await fetchMeetings()
          setMeetings(Meegingsfromserver)
        }
    
        getMeetings()
      }, [])

      // Fetch Notifications
  const fetchMeetings = async () => {
    const res = await fetch('http://localhost:5000/meetings')
    const data = await res.json()

    return data
  }


  return (

    <Card style={{padding:0, margin:0}}  className="bg-secondary shadow border-0 px-2 py-5">
      <h3 >Meetings</h3>
        {meetings.map((meeting) => (
            <Meeting data={meeting} />
            ))}
    </Card>
  );
  
}

export default MeetingsPanel;