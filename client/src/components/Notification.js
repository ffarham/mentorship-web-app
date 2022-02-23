import React, { useState } from "react";
import { UncontrolledAlert, Card } from "reactstrap";

function Notification({data}){
    const {id, text, time, room} = data;
    const [visible, setVisibility] = useState(true);

    const ontoggle = async () => {
        setVisibility(false);

        const res = await fetch(`http://localhost:5000/notifications/${id}`, {
            method: 'DELETE',
        })
    }

    return(
        <UncontrolledAlert fade={false} isOpen={visible}  toggle={ontoggle}>
        <span className="alert-inner--icon">
        <i className="ni ni-bell-55" />
        </span>
        <span className="alert-inner--text ml-1">
        <strong>{room}</strong> - {text} 
        </span>
        </UncontrolledAlert>
    );
}

export default Notification;