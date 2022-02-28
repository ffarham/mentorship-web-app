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
    Col,
    UncontrolledPopover,
    PopoverHeader,
    PopoverBody,
    Badge
  } from "reactstrap";
import {
    Redirect
} from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import api from "../api/api";
import MainFooter from "../components/Navs/MainFooter.js";
import AuthServices from "../api/authService";

function RegisterPage () {

    const history = useHistory();

    // keep track of user inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [accountType, setAccountType] = useState("");
    const [activeDepartment, setActiveDepartment] = useState("");
    const [activeTopics, setActiveTopics] = useState([]);
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");


    // maximum number of interests a user can select
    const maxInterests = 5;

     // get the list of departments and topics
     const [departments, setDepartments] = useState([]);
     const [topics, setTopics] = useState([]);
     const [isLoggedIn, setIsLoggedIn] = useState(false);
     useEffect( () => {
         const authState = localStorage.getItem('authState');
         // if user is already logged in
         if (authState) {
             setIsLoggedIn(true);
         }
         // if user is not already logged in
         else{
             api.get("/api/v1/register").then(
                 (res) => {
                     console.log(res.data);
                     setDepartments(res.data.departments);  
                     setTopics(res.data.topics);    
                 }
                 );
         }
         }, []);
        
    // filter the departments by user input
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const handleDepartmentChange = (e) => {
        const input = e.target.value;
        // if user input is empty, show all
        if (input === ""){
            setFilteredDepartments(departments);
        }else{
            const filteredWords = departments.filter((value) => {
                return value.includes(input);
            });
            setFilteredDepartments(filteredWords);
        }
    }

    // filter the topics by user input
    const [filteredTopics, setFilteredTopics] = useState([]);
    const handleTopicChange = (e) => {
        const input = e.target.value;
        if(input === ""){
            setFilteredTopics(topics);
        }else{
            const filteredWords = topics.filter((value) => {
                return value.includes(input);
            });
            setFilteredTopics(filteredWords);
        }
    }

    // initialise filtered data to departments once fetched, this is so the first empty search will show all departments
    useEffect( () => {
        setFilteredDepartments(departments);
        setFilteredTopics(topics);
    }, [departments, topics]);

    // function to handle topic click
    const handleTopicClick = (value) => {
        
        // get the index of the value in the array
        const i = activeTopics.indexOf(value);
        
        // if array does not contain the value
        if(i === -1){
            // only add if array is not at its limit
            if(activeTopics.length < maxInterests){
                // add value to array
                const newArray = activeTopics.slice();
                newArray.push(value);
                setActiveTopics(newArray);
            }
        }
        // if topic is already added in array
        else{
            // remove it from array
            const newArray = activeTopics.slice();
            newArray.splice(i, 1);
            setActiveTopics(newArray);
        } 
    }

     // if user is already logged in, redirect user to home page
     if (isLoggedIn) {
        return <Redirect to="/home" />
    }

    // function to handle users register request
    const handleRegister = () => {
        // TODO: validate user inputs

        if(confirmPass !== pass){
            // TODO: inform user confirm passowrd does not match password
        }

        const data = {
            'name': name,
            'email': email,
            'userType': accountType,
            'department': activeDepartment,
            'interests': activeTopics,
            'password': pass,
        }
        AuthServices.register(data).then(
            (res) => {
                // on successful registeration
                history.push("/home");
            },
            (error) => {
                // errors: account under email already exists

            }
        );
    }

    
    return(
        <>
            <Container className="pt-lg-7 mb-md">
            <Row className="justify-content-center">
                <Col lg="5">
                <Card className="bg-secondary shadow border-0">
                    <CardHeader className="bg-white pb-2">
                        <div className="btn-wrapper text-center">
                            <h1>Register</h1>
                        </div>
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                    <Form role="form">
                        <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="ni ni-circle-08" />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                    placeholder="Name" 
                                    type="text" 
                                    onChange={ (event) => {
                                        setName(event.target.value);
                                    }}
                                />
                            </InputGroup>
                        </FormGroup>
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
                                    onChange={ (event) => {
                                        setEmail(event.target.value);
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
                                            onChange={() => setAccountType("mentor")}
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
                                            onChange={() => setAccountType("mentee")}
                                        />
                                        <label className="custom-control-label" htmlFor="customRadio2">
                                            <span>Mentee</span>
                                        </label>
                                    </div>
                                    <div className="custom-control custom-radio mt-2">
                                        <input
                                            className="custom-control-input"
                                            id="customRadio3"
                                            name="custom-radio-1"
                                            type="radio"
                                            onChange={() => setAccountType("both")}
                                        />
                                        <label className="custom-control-label" htmlFor="customRadio3">
                                            <span>Both</span>
                                        </label>
                                    </div>
                                </Col>
                            </Row>

                            <hr/>

                        {/* search department */}
                            <Row className="mb-4">
                                <Col className="mt-2" sm="5">
                                    <small className="text-uppercase text-muted font-weight-bold">
                                        Department
                                    </small>
                                </Col>
                                <Col sm="7">
                                    <Input
                                    className="form-control-alternative"
                                    disabled
                                    value={activeDepartment === ""
                                        ? "Empty"
                                        : activeDepartment}
                                    type="text"/>
                                </Col>
                        </Row>
                        <Row className="mr-3">
                            <Col lg="8">
                                <div>
                                    <InputGroup className="input-group-alternative mb-4">
                                        <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-zoom-split-in" />
                                        </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                        placeholder="Find department"
                                        type="text"
                                        onFocus={e => e.preventDefault()}
                                        onBlur={e => e.preventDefault()}
                                        onChange={handleDepartmentChange}
                                        />
                                    </InputGroup>
                                </div>
                                <div>
                                    <UncontrolledPopover
                                    placement="right"
                                    target="departmentSearch"
                                    trigger="legacy"
                                    >
                                        <PopoverHeader>
                                            <div>
                                                <h3 className="heading mb-0">Departments</h3>
                                            </div>
                                        </PopoverHeader>
                                        <PopoverBody>
                                            <div>
                                                {filteredDepartments.length === 0
                                                ? <p>No such department exists</p>
                                                : filteredDepartments.map( (value) => {
                                                    return(
                                                        <div>
                                                            <div onClick={() => setActiveDepartment(value)}>
                                                                <p>{value}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </PopoverBody>
                                    </UncontrolledPopover>
                                    </div>
                            </Col>
                            <Col lg="4">
                                <Button 
                                    id="departmentSearch"
                                    className="btn-1 btn-neutral ml-1"
                                    color="default"
                                    type="button">
                                        Search
                                </Button>
                            </Col>
                        </Row>  
                        
                        {accountType === "mentor" || accountType === ""
                        ? <></>
                        : <>
                            <hr/>

                            <Row className="mb-4">
                                <Col className="" sm="5">
                                    <small className="text-uppercase text-muted font-weight-bold">
                                        Interests
                                    </small>
                                </Col>
                                <Col sm="7">
                                    {activeTopics.length === 0
                                    ? <small className="text-light">Select up to 5</small>
                                    : activeTopics.map( (topic) => {
                                        return(
                                            <Badge className="text-uppercase mr-2 mb-1 px-2" color="primary" pill>
                                                {topic}
                                            </Badge>
                                        );
                                    })                                
                                    }
                                </Col>
                            </Row>
                            <Row className="mr-3">
                                <Col md="8">
                                    <div>
                                        <InputGroup className="input-group-alternative mb-4">
                                            <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="ni ni-zoom-split-in" />
                                            </InputGroupText>
                                            </InputGroupAddon>
                                            <Input
                                            placeholder="Find topic"
                                            type="text"
                                            onChange={handleTopicChange}
                                            />
                                        </InputGroup>
                                    </div>
                                    <div>
                                        <UncontrolledPopover
                                        placement="right"
                                        target="topicSearch"
                                        trigger="legacy"
                                        >
                                            <PopoverHeader>
                                                <div>
                                                    <h3 className="heading mb-0">Topics</h3>
                                                </div>
                                            </PopoverHeader>
                                            <PopoverBody>
                                                <div>
                                                    {filteredTopics.length === 0
                                                    ? <p>No such topic exists</p>
                                                    : filteredTopics.map( (value) => {
                                                        return(
                                                            <div>
                                                                <div onClick={() => handleTopicClick(value)}>
                                                                    <p>{value}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </PopoverBody>
                                        </UncontrolledPopover>
                                    </div>
                                </Col>
                                <Col md="4">
                                    <Button 
                                        id="topicSearch"
                                        className="btn-1 btn-neutral ml-1"
                                        color="default"
                                        type="button">
                                            Search
                                    </Button>
                                </Col>
                            </Row>
                        </>}

                        <hr/>

                        <FormGroup className="mb-3">
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
                                setPass(event.target.value);
                            }}
                            />
                        </InputGroup>
                        </FormGroup>

                        <FormGroup className="mb-3">
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-lock-circle-open" />
                                </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                placeholder="Confirm Password"
                                type="password"
                                autoComplete="off"
                                onChange={ (event) => {
                                    setConfirmPass(event.target.value);
                                }}
                                />
                            </InputGroup>
                        </FormGroup>
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
                        <hr/>
                        <div className="text-center">
                        <Button
                            className=""
                            color="primary"
                            type="button"
                            onClick={handleRegister}
                        >
                            Register
                        </Button>
                        </div>
                    </Form>
                    </CardBody>
                </Card>
                <Row className="mt-3">
                    <Col xs="6">
                    {/* <a
                        className="text-light"
                        // href="#pablo"
                        onClick={e => e.preventDefault()}
                    >
                        <small>Forgot password?</small>
                    </a> */}
                    </Col>
                    <Col className="text-right" xs="6">
                        <Row>
                            <div className="text-light mr-2">
                                <small>Already have an account?</small>
                            </div>
                            <a
                                className="text-light"
                                href="#pablo"
                                onClick={() => history.push("/login")}
                                >
                                <small className="text-primary">Login</small>
                            </a>
                        </Row>
                    </Col>
                </Row>
                </Col>
            </Row>
            </Container>
            <MainFooter />
        </>
    );
}

export default RegisterPage;