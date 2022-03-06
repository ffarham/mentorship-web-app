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

    // check if a user is logged in or not
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect( () => {
        const authState = localStorage.getItem('authState');
        if (authState) {
            setIsLoggedIn(true);
        }
    }, []);

    const [emailErrorMsg, setEmailErrorMsg] = useState("");
    const [passErrorMsg, setPassErrorMsg] = useState("");
    const [userErrorMsg, setUserErrorMsg] = useState("");
    // attempt to log user in
    const handleLogin = async () => {

        // validate user input
        // check if email input is empty
        if (email === ""){
            setEmailErrorMsg("Email field is empty");
            return;
        }
        else{
            // if email doesn't contain an '@' 
            const char = "@";
            if( !email.includes(char) ){
                setEmailErrorMsg("Email does not contain an '@'");
                return;
            }else{
                // reset email error message
                setEmailErrorMsg("");

                // check if password field is empty
                if(password === ""){
                    setPassErrorMsg("Password field is empty");
                    return;
                }else{
                    // reset password error message
                    setPassErrorMsg("");

                    // check if user has selected an account type
                    if(userType === ""){
                        setUserErrorMsg("Please select an account type");
                        return;
                    }else{
                        setUserErrorMsg("");

                        // create JSON onject containing inputted email and password
                        const data = {
                            "email": email, 
                            "password": password, 
                            "userType": userType
                        };
                        try{
                            // attempt to log user in
                            await AuthServices.login(data).then(
                                (response) => {
                                    // error handling
                                    if(response.status === 500){
                                        // TODO: set error message
                                        
                                    }else{
                                        // on successfull login, direct user to the home page
                                        history.push("/home");
                                    }
                                });
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            }
        }        
    };

    // if user is already logged in, redirect user to home page
    if (isLoggedIn) {
        return <Redirect to="/home" />
    }

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
                                {emailErrorMsg === ""
                                ? <></>
                                : <div className="has-danger"></div>}
                            </InputGroup>
                            </FormGroup>

                            {emailErrorMsg === "" 
                            ? <></>
                            : <Row className="mb-3 mt-2">
                                <small className="text-uppercase text-danger font-weight-bold mt-1 mr-2 ml-3">Error:</small>
                                <p className="text-danger mb-0">{emailErrorMsg}</p>
                            </Row>
                            }

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
                                {passErrorMsg === ""
                                ? <></>
                                : <div className="has-danger"></div>}
                            </InputGroup>
                            </FormGroup>

                            {passErrorMsg === "" 
                            ? <></>
                            : <Row className="mb-3 mt-2">
                                <small className="text-uppercase text-danger font-weight-bold mt-1 mr-2 ml-3">Error:</small>
                                <p className="text-danger mb-0">{passErrorMsg}</p>
                            </Row>
                            }

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

                            {userErrorMsg === "" 
                            ? <></>
                            : <Row className="mb-3 mt-2">
                                <small className="text-uppercase text-danger font-weight-bold mt-1 mr-2 ml-3">Error:</small>
                                <p className="text-danger mb-0">{userErrorMsg}</p>
                            </Row>
                            }
                            
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