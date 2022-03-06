import React from 'react'

import {
  Card,
  Row,
  Button,
  Container,
  Col,
  CardText,
  CardTitle,
  CardBody
} from 'reactstrap'

import Feedback from 'components/Feedback'
import MainFooter from 'components/Navs/MainFooter'

function FeedbackPage() {
    return (
    <>
<>
  
  {/* <MainNavbar /> */}
  <div className="btn-wrapper text-center">
      <h1>Feedback Page</h1>
  </div>
  
  <Container fluid="xl" className="m-5">
      <Row>
          <Col sm="12" md="12">
          <Card className="bg-secondary shadow border-0 px-2 py-5 text-center">
                <CardBody>
                    <CardTitle tag="h5" >
                        <div className="btn-wrapper text-center">
                                <h2>Feedback</h2>
                        </div>
                    </CardTitle>
                    <CardText>
                        <div className="scrolling">
                        <Feedback />
                        </div>
                    </CardText>
                </CardBody>               
            </Card>
          </Col>
          <Col sm="12" md="4">
              
          </Col>
      </Row>
  </Container>
  <MainFooter />

</>

    </>

  )
}

export default FeedbackPage