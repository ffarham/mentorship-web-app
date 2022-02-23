import React, { useState, useEffect, useContext } from "react";
import {
    Card
} from 'reactstrap';


import api from "../api/api";
import Notification from "./Notification";
import { UserContext } from "../helpers/UserContext";


function NotificationsPanel(){

    const { userState } = useContext(UserContext);

    const [ notifications, setNotifications ] = useState([]);
  

    //runs when panel gets initially mounted 

    // useEffect( () => {
    //     api
    //         .get("http://localhost:5000/posts")
    //         .then((res) => {
    //             setNotifications(res.posts);   
    //         });
    // }, []);

    useEffect(() => {
        const getNotifications = async () => {
          const NotificationsFromServer = await fetchNotifications()
          setNotifications(NotificationsFromServer)
        }
    
        getNotifications()
      }, [])

      // Fetch Notifications
  const fetchNotifications = async () => {
    const res = await fetch('http://localhost:5000/notifications')
    const data = await res.json()

    return data
  }

    return (

      <Card style={{padding:0, margin:0}}  className="bg-secondary shadow border-0 px-2 py-5">
        <h3 >Notifications</h3>
          {notifications.map((notification) => (
              <Notification data={notification}/>
              ))}
      </Card>
    );
    
}

export default NotificationsPanel;