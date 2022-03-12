import React, { useState } from "react";
import { Button, Modal } from "reactstrap";

function HomeBar({data}){
    const {id, text, time, room, title, contents} = data;
    const [modal, toggleModal] = useState(false);



    return(
        <>
        <Button className="btn-1 ml-1" color="success" type="button" onClick={() => toggleModal(true)}>
        <span className="alert-inner--icon">
        <i className="ni ni-bell-55" />
        </span>
        <span className="alert-inner--text ml-1">
        <strong>{room}</strong> - {text} 
        </span>
        </Button>
        <br></br>

        <Modal
              className="modal-dialog-centered"
              isOpen={modal}
              toggle={() => toggleModal(false)}
            >
              <div className="modal-header">
                <h6 className="modal-title" id="modal-title-default">
                  {title}
                </h6>
                <button
                  aria-label="Close"
                  className="close"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => toggleModal(false)}
                >
                  <span aria-hidden={true}>×</span>
                </button>
              </div>
              <div className="modal-body">
                <p>{contents}</p>
              </div>
              <div className="modal-footer">
                <Button
                  className="ml-auto"
                  color="link"
                  data-dismiss="modal"
                  type="button"
                  onClick={() => toggleModal(false)}
                >
                  Close
                </Button>
              </div>
            </Modal>
        </>
    );
}

export default HomeBar;