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

    // get all users requests
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        api.get(`/api/v1/notifications`).then(
            (res) => {
                if(res.data){
                    setNotifications(res.data);
                }
            }
        );
    }, []);

    return(
        <>
            <Card className="bg-secondary shadow border-0">
                <Row className="mx-4 my-2"> 
                    <div className="mt-2 mb-2">
                        <h4 className="display-4 mb-0">Notifications</h4>
                    </div>
                </Row>
                {/* <Row className="mx-4 my-2"> */}
                {notifications.length === 0
                    ? <div className="mb-3">
                        You have no notifications.
                    </div>
                    : <div className="scrollView mb-3">
                        {notifications.map( (n) => {
                                return(
                                    <div>
                                        <Notification notification={n} />
                                    </div>
                        );})
                        }
                    </div>
                    }
            </Card>
        </>
    );
}

export default NotificationsPanel;