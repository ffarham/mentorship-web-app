import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    Button,
    Modal
} from 'reactstrap';

import  api from "../../api/api";
import MentorMentee from "./MentorMentee";

function FindMentor({ setFindMentorView }){

    // get users recommended mentors
    const [recommendedMentors, setRecommendedMentors] = useState([]);
    useEffect(() => {
        api.get("api/v1/matching").then(
            (res) => {
                setRecommendedMentors(res.data);
            }
        );
    }, []);
    console.log(recommendedMentors);

    // handle user selecting a new mentor
    const [activeMentor, setActiveMentor] = useState({});
    const [popup, setPopup] = useState(false);
    const handleMentorClick = (mentor) => {
        setActiveMentor(mentor);
        setPopup(true);
    }

    // handle intiation request made to the mentor
    const [resPopup, setResPopup] = useState(false);
    const handleRequest = () => {
        console.log("handling");
        api.post("api/v1/mentorshipRequest", activeMentor).then(
            (res) => {
                setPopup(false);
                setActiveMentor({});
                setResPopup(true);
            }
        );
    }

    return(
        <>
            <Row className="mb-3">
                <Col lg="1">
                </Col>
                <Col lg="10">
                    <Button 
                        color="primary" 
                        type="button"
                        onClick={() => setFindMentorView(false)}>
                        Return
                    </Button>
                </Col>
                <Col lg="1">
                </Col>
            </Row>
            <Row>
                <Col lg="1"></Col>

                <Col lg="10">
                    <Card className="bg-secondary shadow border-0">
                        <Row className="mx-4 my-2"> 
                            <div className="mt-2">
                                <h4 className="display-4 mb-0">Recommended Mentors</h4>
                            </div>
                        </Row>
                        <Row className="mx-4 my-2">
                            {recommendedMentors.length === 0
                            ? <div className="mb-3">
                                You have no recommended mentors.
                            </div>
                            : <div className="mb-3">
                                {recommendedMentors.map( (mentor) => {
                                return(
                                    <div>
                                        <a href="#group38" onClick={() => handleMentorClick(mentor)}>
                                            <MentorMentee mentorMentees={mentor} />
                                        </a>
                                    </div>
                                );})
                                }
                                
                                <Modal
                                className="modal-dialog-centered"
                                isOpen={popup}
                                toggle={() => setPopup(false)}
                                >
                                <div className="modal-header">
                                    <h6 className="modal-title mt-2" id="modal-title-default">
                                        Recommendation
                                    </h6>
                                    <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setPopup(false)}
                                    >
                                    <span aria-hidden={true}>×</span>
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <Row>
                                        <Col lg="4">
                                            <div className="text-left">
                                                <small className="text-uppercase text-muted font-weight-bold">
                                                    Name 
                                                </small>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <p>
                                                {activeMentor.name}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="4">
                                            <div className="text-left">
                                                <small className="text-uppercase text-muted font-weight-bold">
                                                    Email 
                                                </small>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <p>
                                                {activeMentor.email}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="4">
                                            <div className="text-left">
                                                <small className="text-uppercase text-muted font-weight-bold">
                                                    Department 
                                                </small>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <p>
                                                {activeMentor.department}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="4">
                                            <div className="text-left">
                                                <small className="text-uppercase text-muted font-weight-bold">
                                                    Bio 
                                                </small>
                                            </div>
                                        </Col>
                                        <Col lg="8">
                                            <p>
                                                {activeMentor.bio}
                                            </p>
                                        </Col>
                                    </Row>
                                </div>

                                <div className="modal-footer">
                                   <Button 
                                            color="primary" 
                                            type="button"
                                            onClick={handleRequest}>
                                            Submit a request
                                        </Button> 
                                    <Button
                                    className="ml-auto"
                                    color="link"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setPopup(false)}
                                    >
                                    Close
                                    </Button>
                                </div>
                                </Modal>

                                <Modal
                                className="modal-dialog-centered"
                                isOpen={resPopup}
                                toggle={() => setResPopup(false)}
                                >
                                <div className="modal-header">
                                    <h6 className="modal-title mt-2" id="modal-title-default">
                                        Success
                                    </h6>
                                    <button
                                    aria-label="Close"
                                    className="close"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setResPopup(false)}
                                    >
                                    <span aria-hidden={true}>×</span>
                                    </button>
                                </div>

                                <div className="modal-body">
                                    <p>Request has been submitted</p>
                                </div>

                                <div className="modal-footer">
                                    <Button
                                    className="ml-auto"
                                    color="link"
                                    data-dismiss="modal"
                                    type="button"
                                    onClick={() => setResPopup(false)}
                                    >
                                    Close
                                    </Button>
                                </div>
                                </Modal>
                            </div>
                            }
                        </Row>
                    </Card>
                </Col>

                <Col lg="1"></Col>
            </Row>
        </>
    );
}

export default FindMentor;