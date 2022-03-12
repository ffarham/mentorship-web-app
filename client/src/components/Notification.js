import React, { useState } from 'react';
import {
    Col,
    Row,
    Card,
    Modal,
    Button
} from 'reactstrap';
import api from "../api/api";

function Notification({ notification, parentCallback }){

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userType = "mentee"; //const userType = authState.userType;

    const [modal, setModal] = useState(false);

    const setEnlarge = (flag) => {
        if (flag === true) {
            document.getElementById(notification.notificationID).style.color = "red";
        } else {
            document.getElementById(notification.notificationID).style.color = "black";
        }
    }

    const dismissNotification = () => {
        setModal(false);

        api.post(`/api/v1/dismissnotification/${notification.notificationID}`).then(
            (res) => {

            }
        );
        document.getElementById("notification" + notification.notificationID).remove();
        parentCallback();
    }



    return(
        <>  
            <Card id={"notification" + notification.notificationID} className="bg-secondary shadow border-0 my-2  p-2 mb-3">
                <Row className="my-2">
                    <Col className="" sm="10" onClick={() => setModal(true)}>
                        <i class="ni ni-bell-55"></i>{"  " + notification.type}
                    </Col>

                    <Col className="" sm="2">
                        <i id={notification.notificationID} class="fa fa-times" aria-hidden="true" onMouseEnter={() => setEnlarge(true)}
                            onMouseLeave={() => setEnlarge(false)} onClick = {() => dismissNotification()}></i>
                    </Col>
                </Row>
            </Card>

            <Modal
          className="modal-dialog-centered"
          isOpen={modal}
          toggle={() => setModal(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-success" id="modal-title-default">
                  {notification.type}
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setModal(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">

          <Row className="mb-4">
                    <Col className="mt-1" lg="2">
                        <small className="text-uppercase text-muted font-weight-bold">
                            Time
                        </small>
                    </Col>
                    <Col md="6">
                    </Col>
                    <Col md="2">
                    <small className="text-uppercase text-muted font-weight-bold">
                            {notification.timeCreated}
                        </small>
                    </Col>
                    <Col md="2"></Col>
                </Row>

                <Row className="mb-4">
                    <Col className="">
                    <hr />
                        <small className="text-uppercase text-muted font-weight-bold">
                            Message
                        </small>

                        <p>{notification.msg}</p>
                        
                    </Col>
                </Row>


          </div>

          <div className="modal-footer">
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setModal(false)}
              >
              Close
              </Button>
          </div>
          </Modal>
        </>
    );
}   

export default Notification;