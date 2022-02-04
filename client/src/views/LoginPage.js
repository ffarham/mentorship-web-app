import React from "react";
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Container,
    Row,
    Col
  } from "reactstrap";

import MainNavbar from "../components/Navs/MainNavbar.js";

import Navbars from "./IndexSections/Navbars.js";
import MainFooter from "../components/Navs/MainFooter.js";

class Login extends React.Component {
    render(){
        return(
            <>
                <main ref="main">
                        <Container className="pt-lg-7 mb-md">
                        <Row className="justify-content-center">
                            <Col lg="5">
                            <Card className="bg-secondary shadow border-0">
                                <CardHeader className="bg-white pb-5">
                                <div className="btn-wrapper text-center">
                                   <h1>Logo</h1>
                                </div>
                                </CardHeader>
                                <CardBody className="px-lg-5 py-lg-5">
                                <Form role="form">
                                    <FormGroup className="mb-3">
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-email-83" />
                                        </InputGroupText>
                                        </InputGroupAddon>
                                        <Input placeholder="Email" type="email" />
                                    </InputGroup>
                                    </FormGroup>
                                    <FormGroup>
                                    <InputGroup className="input-group-alternative">
                                        <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-lock-circle-open" />
                                        </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                        placeholder="Password"
                                        type="password"
                                        autoComplete="off"
                                        />
                                    </InputGroup>
                                    </FormGroup>
                                    <div className="custom-control custom-control-alternative custom-checkbox">
                                    <input
                                        className="custom-control-input"
                                        id=" customCheckLogin"
                                        type="checkbox"
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor=" customCheckLogin"
                                    >
                                        <span>Remember me</span>
                                    </label>
                                    </div>
                                    <div className="text-center">
                                    <Button
                                        className="my-4"
                                        color="primary"
                                        type="button"
                                    >
                                        Sign in
                                    </Button>
                                    </div>
                                </Form>
                                </CardBody>
                            </Card>
                            <Row className="mt-3">
                                <Col xs="6">
                                <a
                                    className="text-light"
                                    href="#pablo"
                                    onClick={e => e.preventDefault()}
                                >
                                    <small>Forgot password?</small>
                                </a>
                                </Col>
                                <Col className="text-right" xs="6">
                                <a
                                    className="text-light"
                                    href="#pablo"
                                    onClick={e => e.preventDefault()}
                                >
                                    <small>Create new account</small>
                                </a>
                                </Col>
                            </Row>
                            </Col>
                        </Row>
                        </Container>
                    {/* </section> */}
                </main>
                <div className="relative">
                    <MainFooter />
                </div>
            </>
        );
    }
}

export default Login;