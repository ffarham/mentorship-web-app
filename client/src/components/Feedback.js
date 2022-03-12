import React, {useState} from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Pagination,
    PaginationLink,
    PaginationItem,
    Modal
} from 'reactstrap';
import api from "../api/api";



function Feedback() {

  const [active, setAcive] = useState(0);

  const [alertPopup, setAlertPopup] = useState(false);

  const userID = 1;

  const submitFeedback = () => { 

    const data = {rating: active, feedback: document.getElementById("textbox").value};
    api.post(`/api/v1/feedback`, data).then(
        (res) => {
            
        }
  );
  document.getElementById("textbox").value = "";
  setAcive(0);
  setAlertPopup(true);
}

  return (
    <>
      <div className="m-2">
        <Row className="mb-4">
          <Col>
              <div className="">
                  <h4 className="display-4 mb-0">Feedback</h4>
              </div>
          </Col>
        </Row>
        <hr />
        <Row className="ml-2">
          <p>How would you rate this product out of 5?</p>
        </Row>

        <Row className="ml-2">
        <Pagination>
              { active === 1 ? 
              <PaginationItem className="active">
                <PaginationLink onClick={() => setAcive(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
                :
              <PaginationItem >
                <PaginationLink  onClick={() => setAcive(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              }

              { active === 2 ?
              <PaginationItem className="active">
                <PaginationLink href="#pablo" onClick={() => setAcive(2)}>
                  2
                </PaginationLink>
              </PaginationItem>
                :  
              <PaginationItem >
                <PaginationLink href="#pablo" onClick={() => setAcive(2)}>
                  2
                </PaginationLink>
              </PaginationItem>
              }

              {active === 3 ?
              <PaginationItem className="active">
                <PaginationLink href="#pablo" onClick={() => setAcive(3)}>
                  3
                </PaginationLink>
              </PaginationItem>
                :
              <PaginationItem>
                <PaginationLink href="#pablo" onClick={() => setAcive(3)}>
                  3
                </PaginationLink>
              </PaginationItem>
              }

              {active === 4 ?
              <PaginationItem className="active">
                <PaginationLink href="#pablo" onClick={() => setAcive(4)}>
                  4
                </PaginationLink>
              </PaginationItem>
                :
              <PaginationItem>
                <PaginationLink href="#pablo" onClick={() => setAcive(4)}>
                  4
                </PaginationLink>
              </PaginationItem>
              }

              {active === 5 ?
              <PaginationItem className="active">
                <PaginationLink href="#pablo" onClick={() => setAcive(5)}>
                  5
                </PaginationLink>
              </PaginationItem>
                  :
              <PaginationItem>
                <PaginationLink href="#pablo" onClick={() => setAcive(5)}>
                  5
                </PaginationLink>
              </PaginationItem>
              }
            </Pagination>  
        </Row>

        <Row className="ml-2">
          <p>Explain your score:</p>
        </Row>

        <Row className="mb-4">
            <textarea id="textbox" className="feedbackform">
                
            </textarea>
        </Row>
        <Row className="mx-4 float-right">
          <Button
          className="btn-1" 
          color="primary"
          onClick={() => submitFeedback()}>
            Submit
          </Button>
        </Row>

        <Modal
          className="modal-dialog-centered"
          isOpen={alertPopup}
          toggle={() => setAlertPopup(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-success" id="modal-title-default">
                  Success
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setAlertPopup(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">
              <p>Submitted feedback successfully</p>
          </div>

          <div className="modal-footer">
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setAlertPopup(false)}
              >
              Close
              </Button>
          </div>
          </Modal>
      </div>
  </>
  );
}


export default Feedback;