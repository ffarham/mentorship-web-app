import React from "react";
import {Card} from 'reactstrap';

//checks if a array is emtpy
function isEmtpy(meetings) {
    return Object.keys(meetings).length === 0;
}

const test = []

class MeetingsPanel extends React.Component {
    render () {
        return <Card className="bg-secondary shadow border-0 px-2 py-5">
            <>           
            {!isEmtpy(this.props.meetings) ? this.props.meetings.map((meeting) => (
                <span>
                <h2 key={meeting.id}>{meeting.text}</h2>
                <h5>{meeting.date}</h5>
                </span>
            )) : <h1>No meetings to Show</h1>}
            </>  
        </Card>
    }
}

export default MeetingsPanel;