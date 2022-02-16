import React from "react";
import {Card} from 'reactstrap';

function Notification({data}){
    const {id, text, time, room} = data;
    return(
        <Card>
            <p>{text}</p>
            <p>{time}</p>
            <p>{room}</p>
        </Card>
    );
}

export default Notification;