import React, { useState, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Modal,
    Badge
} from 'reactstrap';

import api from "../api/api";
import Notification from "./Notification";

function NotificationsPanel(){

    const [numNotifications, setNumNotifications] = useState(2);

    // get all users requests
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        api.get(`/api/v1/notifications`).then(
            (res) => {
                if(res.data){
                    setNotifications(res.data);
                    setNumNotifications(res.data.length);
                }
            }
        );
    }, []);

    const handleCallback = () =>{
        setNumNotifications(numNotifications-1);

        console.log(numNotifications);

        if (numNotifications === 1) {
            document.getElementById("span").innerHTML = "<div className='ml-4'><p>&nbsp&nbsp&nbsp&nbsp&nbspYou have no notifications.</p></div>";
        }
    }

    return(
        <>
            <Card className="bg-secondary shadow border-0">
                <Row> 
                    <div className="text-center  ml-4 mt-4">
                        <h4 className="display-4 mb-0">Notifications</h4>
                    </div>
                </Row>
                <div className="mx-4">
                    <hr/>
                </div>
                {/* <Row className="mx-4 my-2"> */}
                <span id="span">
                    {notifications.length === 0
                        ? <div className="ml-4">
                            <p>You have no notifications.</p>
                        </div>
                        : <div className="scrollView mb-3">
                            {notifications.map( (n) => {
                                    return(
                                        <div>
                                            <Notification parentCallback = {handleCallback} notification={n} />
                                        </div>
                            );})
                            }
                        </div>
                        }
                    </span>
            </Card>
        </>
    );
}

export default NotificationsPanel;