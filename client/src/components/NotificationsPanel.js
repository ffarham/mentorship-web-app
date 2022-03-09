import React, { useState, useEffect, useContext } from "react";
import {
    Card
} from 'reactstrap';


import api from "../api/api";
import Notification from "./Notification";


function NotificationsPanel(){

    // get user information
    //const authState = JSON.parse(localStorage.getItem('authState'));
    //const userID = authState.userID;
    const userID = 1;

    const [ notifications, setNotifications ] = useState([]);

    // get all of user's notifications.
    useEffect(() => {
      const url = `/api/v1/notifications/${userID}`;
      api.get(url).then(
          (res) => {
              if(res.data){
                  console.log(res.data);
                  setNotifications(res.data);
              }
          },
          // runs when response status falls out of 2xx
          (error) => {
              console.log(error);
          }
      );
  }, []);
  
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