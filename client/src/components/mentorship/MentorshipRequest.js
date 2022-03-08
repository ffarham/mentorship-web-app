import React from 'react';
import {
    Card,
    Container,
    Row
} from 'reactstrap';

function MentorshipRequest(){
    return(
        <>
            <Container fluid="xl">
                <Card className="bg-secondary shadow border-0">
                    <Row className="mx-3 mt-3">
                        <div>
                            <h4 className="display-4 mb-0">Requests</h4>
                        </div>
                    </Row>
                    <Row className="mx-3 my-2 mt-2">
                        <p>hi</p>
                    </Row>
                </Card>
            </Container>
        </>
    );
}

export default MentorshipRequest;