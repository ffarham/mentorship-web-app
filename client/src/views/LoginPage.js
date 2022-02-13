import React, { useState, useContext } from "react";
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
import { useHistory } from "react-router-dom";
import { UserContext } from "../helpers/UserContext.js";
import MainFooter from "../components/Navs/MainFooter.js";
import AuthServices from "../api/authService";


function LoginPage() {   

    // stack of all previous pages
    let history = useHistory();

    // // store of inputted email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // // set the user state after successful login
    const { setUserState } = useContext(UserContext);

    // attempt to log user in
    const handleLogin = async () => {
        // TODO: validate user input

        // post to backend, if success, direct user to home page ,else handle error
        const data = {
            email: email,
            password: password 
        };
        try{
            await AuthServices.login(data).then(
                // TODO: get response data and set user context here instead of in AuthService.login function
                () => {
                    history.push("/home");
                },
                (error) => {
                    // TODO: handle error and inform user appropipately
                    console.log(error);
                }
            );
        } catch (err) {
            // TODO: handle error and inform user appropipately
            console.log(err);
        }
    };

    return(
        <>
            <div>
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
                                <Input 
                                    placeholder="Email" 
                                    type="email" 
                                    onchange={ (event) => {
                                        setEmail(event.target.value);
                                    }} />
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
                                onChange={ (event) => {
                                    setPassword(event.target.value);
                                }}
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
                                onClick={handleLogin}
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
                            onClick={() => {history.push("/register");}}
                        >
                            <small>Create new account</small>
                        </a>
                        </Col>
                    </Row>
                    </Col>
                </Row>
                </Container>
            </div>
            <div className="relative">
                <MainFooter />
            </div>
        </>
    );
}

export default LoginPage;