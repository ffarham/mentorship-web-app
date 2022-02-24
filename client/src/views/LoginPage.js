import React, { useState, useEffect } from "react";
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
import { useHistory, Redirect } from "react-router-dom";
import MainFooter from "../components/Navs/MainFooter.js";
import AuthServices from "../api/authService";


function LoginPage() {   

    
    let history = useHistory();
    
    // store inputted email and password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // check if a user is logged in or not
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect( () => {
        const authState = localStorage.getItem('authState');
        if (authState) {
            setIsLoggedIn(true);
        }
    }, []);
    // if user is already logged in, redirect user to home page
    if (isLoggedIn) {
        return <Redirect to="/home" />
    }

    // attempt to log user in
    const handleLogin = async () => {
        // TODO: validate user input

        // create JSON onject containing inputted email and password
        const data = {"email": email, "password": password};
        try{
            // attempt to log user in
            await AuthServices.login(data).then(
                (res) => {
                    // on successfull login, direct user to the home page
                    history.push("/home");
                }
            );
        } catch (err) {
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
                            {/* Email input */}
                            <FormGroup>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-lock-circle-open" />
                                </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    onChange={ (event) => {
                                        setEmail(event.target.value);
                                        console.log("hello");
                                    }}
                                />
                            </InputGroup>
                            </FormGroup>

                            {/* Password input */}
                            <FormGroup>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-lock-circle-open" />
                                </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    autoComplete="off"
                                    onChange={ (event) => {
                                        setPassword(event.target.value);
                                        console.log("world");
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
                            onClick={() => {}}
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