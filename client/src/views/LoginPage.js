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
    const [userType, setUserType] = useState("");

    // update user type when user toggles the switch
    const handleToggle = () => {
        userType === "mentor" ? setUserType("mentee") : setUserType("mentor");
    }

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

        // validate inputted email
        if(email === ""){ 
            // TODO: inform user they must input an email
            // TODO: check if email contains '@'
        }

        // check if user has selected a user type 
        if(userType === ""){
            // inform user one of them is required
        }

        // create JSON onject containing inputted email and password
        const data = {"email": email, "password": password, "userType": userType};
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
                        <CardHeader className="bg-white pb-2">
                        <div className="btn-wrapper text-center">
                            <h1>Login</h1>
                        </div>
                        </CardHeader>
                        <CardBody className="px-lg-5 py-lg-5">
                        <Form role="form">
                            {/* Email input */}
                            <FormGroup>
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-email-83" />
                                </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    onChange={ (event) => {
                                        setEmail(event.target.value);
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
                                    }}
                                />
                            </InputGroup>
                            </FormGroup>

                            <hr/>

                            <Row className="justify-content-center">
                                <Col sm="4">
                                    <small className="text-uppercase text-muted font-weight-bold">
                                        Account
                                    </small>
                                </Col>
                                <Col sm="8">
                                    <div className="custom-control custom-radio">
                                        <input
                                            className="custom-control-input"
                                            id="customRadio1"
                                            name="custom-radio-1"
                                            type="radio"
                                            onChange={() => setUserType("mentor")}
                                        />
                                        <label className="custom-control-label" htmlFor="customRadio1">
                                            <span>Mentor</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-radio mt-2">
                                        <input
                                            className="custom-control-input"
                                            id="customRadio2"
                                            name="custom-radio-1"
                                            type="radio"
                                            onChange={() => setUserType("mentee")}
                                        />
                                        <label className="custom-control-label" htmlFor="customRadio2">
                                            <span>Mentee</span>
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                            
                            <hr/>
                           
                            {/* <div className="custom-control custom-control-alternative custom-checkbox">
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
                            </div> */}
                            
                            <div className="text-center">
                            <Button
                                className=""
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
                        {/* <a
                            className="text-light"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                        >
                            <small>Forgot password?</small>
                        </a> */}
                        </Col>
                        <Col className="text-right" xs="6">
                        <a
                            className="text-light"
                            href="#pablo"
                            onClick={() => history.push("/register")}
                        >
                            <small className="text-primary">Create new account</small>
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