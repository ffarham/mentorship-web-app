import React from 'react';
import {
    Col,
    Row,
    Card
} from 'reactstrap';

function MentorshipRequest({ request }){

    // get userID and userType
    const authState = JSON.parse(localStorage.getItem('authState'));
    const userType = authState.userType;

    console.log("in request: " + JSON.stringify(request));

    return(
        <>  
            <Card className="bg-secondary shadow border-0 my-2  p-2 mb-3">
                <Row className="my-2">
                    <Col className="" sm="6">
                        <span>{request.user.name}</span>
                    </Col>
                    <Col className="" sm="6">
                        <Row className="float-right mr-2">
                            {userType === "mentee"
                            ? <p className="text-warning mb-0">pending</p>
                            : <></>}
                        </Row>
                    </Col>
                </Row>
            </Card>
        </>
    );
}   

export default MentorshipRequest;