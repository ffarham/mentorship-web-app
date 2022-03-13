import React, {useState, useEffect} from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Modal,
    UncontrolledPopover,
    PopoverBody,
    PopoverHeader,
} from 'reactstrap';
import api from "../api/api";

function Account({data}) {

    // kepp track of whether the user wants to edit the email or not
    const [editEmail, setEditEmail] = useState(false);

    //checks if the emails match
    const [emailError, setEmailError] = useState(false);

    //checks if the email is in the deutch bank format
    const [noDeutschBank, setNoDeutschBank] = useState(false);

    // keep track of whether user wants to change password
    const [changePassword, setChangePassword] = useState(false);

    const [incorrectPassword, setIncorrectPassword] = useState(false);

    const [misMatchingPasswords, setMissMatchingPasswords] = useState(false);


    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [changeDeparment, setChangeDeparment] = useState(false);
    const [activeDepartment, setActiveDepartment] = useState("");
    const [noChange, setNoChange] = useState(false);

    const [deleteAccount, setDeleteAccount] = useState(false);

    useEffect( () => {
        const authState = localStorage.getItem('authState');

        // if user is not already logged in
        api.get("/api/v1/register").then(
            (res) => {
                setDepartments(res.data.departments);  
            }
            );
        setActiveDepartment(data.department);
    }, []);

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

    // initialise filtered data to departments once fetched, this is so the first empty search will show all departments
    useEffect( () => {
        setFilteredDepartments(departments);
    }, [departments]);


    const updateEmail = () => {

        if (document.getElementById("confemail").value === document.getElementById("newemail").value) {

            if (document.getElementById("confemail").value.includes("@deutschband.co.uk")) {

                const data = {newemail: document.getElementById("confemail").value, password: document.getElementById("emailpassword").value};
                api.post(`/api/v1/email`, data).then(
                    (res) => {

                        if (res.status === 500) {
                            setIncorrectPassword(true);
                            document.getElementById("confemail").value = "";
                            document.getElementById("newemail").value = "";
                            document.getElementById("emailpassword").value = "";
                        } else {
                            setEditEmail(false);
                            document.getElementById("emailInput").value = document.getElementById("newemail").value;
                        }      
                    }
                );
            } else {
                setNoDeutschBank(true);
                document.getElementById("confemail").value = "";
                document.getElementById("newemail").value = "";
                document.getElementById("emailpassword").value = "";
            }
        } else {
            setEmailError(true);
            document.getElementById("confemail").value = "";
            document.getElementById("newemail").value = "";
            document.getElementById("emailpassword").value = "";
        }
  }

  const updatePassword = () => {
    const userID = 1;   //MUST CHANGE THIS LATER TO THE 'AUTHSTATE.USERID'
    const userPass = document.getElementById("currpassword").value;
    const newpassword = document.getElementById("newpass").value;
    const confnewpassword = document.getElementById("confnewpass").value;
    var flag = false;

    if (newpassword == confnewpassword) {

        const data = {password: userPass, newpassword: newpassword};
        api.post(`/api/v1/password`, data).then(
            (res) => {

                if (res.status === 500) {
                    setIncorrectPassword(true);
                    document.getElementById("currpassword").value = "";
                    document.getElementById("newpass").value = "";
                    document.getElementById("confnewpass").value = "";
                } else {
                    setChangePassword(false);
                }
                
            }
        );

    } else {
        setMissMatchingPasswords(true);
        document.getElementById("currpassword").value = "";
        document.getElementById("newpass").value = "";
        document.getElementById("confnewpass").value = "";
        }
    }

    const updateDeparment = () => {
        const dep = document.getElementById("department").value;

        if (dep === data.department) {
            setNoChange(true);
        } else {
            const data = {password: document.getElementById("departmentPass").value, newdepartment: dep};
                api.post(`/api/v1/department`, data).then(
                    (res) => {

                        if (res.status === 500) {
                            setIncorrectPassword(true);

                        } else {
                            setChangeDeparment(false);
                            document.getElementById("depInput").value = dep;
                        }
                        
                    }
                );
        }
        
  }


  const delAccount = () => {
    const pass = document.getElementById("delpassword").value;  
    const confpass = document.getElementById("confdelpassword").value;
    if (pass === confpass) {

        const data = {password: pass};
        api.post(`/api/v1/deleteProfile`, data).then(
            (res) => {       

                if (res.status === 500) {
                    setIncorrectPassword(true);
                    document.getElementById("delpassword").value = "";
                    document.getElementById("confdelpassword").value = "";

                } else {
                    window.location.href = "/";
                }
                
            }
        );
    } else {
        document.getElementById("delpassword").value = "";
        document.getElementById("confdelpassword").value = "";
        setMissMatchingPasswords(true);
    }
    
}


    return(
        <>
            <div className="m-2">
                <Row className="mb-4">
                    <Col>
                        <div className="">
                            <h4 className="display-4 mb-0">Account</h4>
                        </div>
                    </Col>
                </Row>
                <hr />
                <Row className="mb-4">
                    <Col className="mt-1" lg="2">
                        <small className="text-uppercase text-muted font-weight-bold">
                            Email
                        </small>
                    </Col>
                    <Col md="6">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="ni ni-email-83" />
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input 
                                id = "emailInput"
                                placeholder={"  " + data.email}
                                type="email"
                                onChange={ () => {}}/>
                        </InputGroup>
                    </Col>
                    <Col md="2"></Col>
                    <Col md="2">
                        <Button 
                            className="btn-1" 
                            color="primary" 
                            outline type="button"
                            onClick={() => setEditEmail(!editEmail)}
                        >
                            Edit
                        </Button>
                    </Col>
                </Row>
                <hr/>

                <Row className="mb-4">
                    <Col className="mt-1" lg="2">
                        <small className="text-uppercase text-muted font-weight-bold">
                            Department
                        </small>
                    </Col>
                    <Col md="6">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="ni ni-email-83" />
                            </InputGroupText>
                            </InputGroupAddon>
                            <Input 
                                id = "depInput"
                                placeholder={"  " + data.department}
                                type="email"
                                onChange={ () => {}}/>
                        </InputGroup>
                    </Col>
                    <Col md="2"></Col>
                    <Col md="2">
                        <Button 
                            className="btn-1" 
                            color="primary" 
                            outline type="button"
                            onClick={() => setChangeDeparment(true)}
                        >
                            Edit
                        </Button>
                    </Col>
                </Row>

                <hr />

                <Button 
                    className="btn-1" 
                    color="primary" 
                    outline type="button"
                    onClick={() => setChangePassword(!changePassword)}
                >
                    Edit Password
                </Button>

                
                <Button 
                    className="btn-1" 
                    color="primary" 
                    outline type="button"
                    onClick={() => setDeleteAccount(true)}
                >
                    Delete account
                </Button>

                <hr/>

                
            </div>



            <Modal
          className="modal-dialog-centered"
          isOpen={editEmail}
          toggle={() => setEditEmail(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-success" id="modal-title-default">
                  Edit email
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setEditEmail(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">
              
          <Row className="mb-4">
            <Col className="mt-1" lg="2">
                <small className="text-uppercase text-muted font-weight-bold">
                    New email
                </small>
            </Col>
            <Col md="10">
                <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <i className="ni ni-email-83" />
                    </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        id = "newemail"
                        placeholder={"  New Email"}
                        type="email"
                        onChange={ () => {}}/>
                </InputGroup>
            </Col>
        </Row>

        <Row className="mb-4">
            <Col className="mt-1" lg="2">
                <small className="text-uppercase text-muted font-weight-bold">
                    Confirm email
                </small>
            </Col>
            <Col md="10">
                <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                        <i className="ni ni-email-83" />
                    </InputGroupText>
                    </InputGroupAddon>
                    <Input
                        id = "confemail" 
                        placeholder={"  Confirm Email"}
                        type="email"
                        onChange={ () => {}}/>
                </InputGroup>
            </Col>
        </Row>

        <Row className="mb-4">
                <Col className="mt-1" lg="2">
                    <small className="text-uppercase text-muted font-weight-bold">
                        Password
                    </small>
                </Col>
                <Col md="10">
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            id = "emailpassword"
                            placeholder={"  What is your password?"}
                            type="password"
                            onChange={ () => {}}/>
                    </InputGroup>
                </Col>
            </Row>

          </div>

          <div className="modal-footer">
                <Button color="primary" type="button" onClick={() => updateEmail()}>
                  Submit
                </Button>
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setEditEmail(false)}
              >
              Close
              </Button>
          </div>
          </Modal>


          <Modal
          className="modal-dialog-centered"
          isOpen={emailError}
          toggle={() => setEmailError(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-danger" id="modal-title-default">
                  Error
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setEmailError(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">
              <p>Error, your emails don't match</p>
          </div>

          <div className="modal-footer">
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setEmailError(false)}
              >
              Close
              </Button>
          </div>
          </Modal>

          <Modal
          className="modal-dialog-centered"
          isOpen={noDeutschBank}
          toggle={() => setNoDeutschBank(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-danger" id="modal-title-default">
                  Error
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setNoDeutschBank(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">
              <p>Error, your must use your company email</p>
          </div>

          <div className="modal-footer">
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setNoDeutschBank(false)}
              >
              Close
              </Button>
          </div>
          </Modal>

          <Modal
          className="modal-dialog-centered"
          isOpen={changePassword}
          toggle={() => setChangePassword(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-success" id="modal-title-default">
                  Change passowrd
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setChangePassword(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">
              
            <Row className="mb-4">
                <Col className="mt-1" lg="2">
                    <small className="text-uppercase text-muted font-weight-bold">
                        Current password
                    </small>
                </Col>
                <Col md="10">
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            id = "currpassword"
                            placeholder={"  Current password"}
                            type="password"
                            onChange={ () => {}}/>
                    </InputGroup>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col className="mt-1" lg="2">
                    <small className="text-uppercase text-muted font-weight-bold">
                        New password
                    </small>
                </Col>
                <Col md="10">
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            id = "newpass"
                            placeholder={"  New password"}
                            type="password"
                            onChange={ () => {}}/>
                    </InputGroup>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col className="mt-1" lg="2">
                    <small className="text-uppercase text-muted font-weight-bold">
                        Confirm Password
                    </small>
                </Col>
                <Col md="10">
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            id = "confnewpass"
                            placeholder={"  Confirm password"}
                            type="password"
                            onChange={ () => {}}/>
                    </InputGroup>
                </Col>
            </Row>

          </div>

          <div className="modal-footer">
                <Button color="primary" type="button" onClick={() => updatePassword()}>
                  Submit
                </Button>
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setChangePassword(false)}
              >
              Close
              </Button>
          </div>
          </Modal>


          <Modal
          className="modal-dialog-centered"
          isOpen={incorrectPassword}
          toggle={() => setIncorrectPassword(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-danger" id="modal-title-default">
                  Error
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setIncorrectPassword(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">
              <p>Error, your password was incorrect</p>
          </div>

          <div className="modal-footer">
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setIncorrectPassword(false)}
              >
              Close
              </Button>
          </div>
          </Modal>

          <Modal
          className="modal-dialog-centered"
          isOpen={misMatchingPasswords}
          toggle={() => setMissMatchingPasswords(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-danger" id="modal-title-default">
                  Error
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setMissMatchingPasswords(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">
              <p>Error, your passwords must match</p>
          </div>

          <div className="modal-footer">
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setMissMatchingPasswords(false)}
              >
              Close
              </Button>
          </div>
          </Modal>

          <Modal
          className="modal-dialog-centered"
          isOpen={changeDeparment}
          toggle={() => setChangeDeparment(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-success" id="modal-title-default">
                  Change department
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setChangeDeparment(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">

          <Row className="mb-4">
            <Col className="mt-2" sm="5">
                <small className="text-uppercase text-muted font-weight-bold">
                    Department
                </small>
            </Col>
            <Col sm="7">
                <Input
                id = "department"
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

        <Row className="mb-4">
                <Col className="mt-1" lg="2">
                    <small className="text-uppercase text-muted font-weight-bold">
                        Password
                    </small>
                </Col>
                <Col md="10">
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            id = "departmentPass"
                            placeholder={"  What is your password?"}
                            type="password"
                            onChange={ () => {}}/>
                    </InputGroup>
                </Col>
            </Row>         

          </div>

          <div className="modal-footer">
                <Button color="primary" type="button" onClick={() => updateDeparment()}>
                  Submit
                </Button>
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setChangeDeparment(false)}
              >
              Close
              </Button>
          </div>
          </Modal>

          <Modal
          className="modal-dialog-centered"
          isOpen={noChange}
          toggle={() => setNoChange(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-danger" id="modal-title-default">
                  Error
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setNoChange(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">
              <p>Error, your new deparment is the same as your old one</p>
          </div>

          <div className="modal-footer">
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setNoChange(false)}
              >
              Close
              </Button>
          </div>
          </Modal>



          <Modal
          className="modal-dialog-centered"
          isOpen={deleteAccount}
          toggle={() => setDeleteAccount(false)}
          >
          <div className="modal-header">
              <h6 className="modal-title mt-2 text-danger" id="modal-title-default">
                  Delete account
              </h6>
              <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setDeleteAccount(false)}
              >
              <span aria-hidden={true}>×</span>
              </button>
          </div>

          <div className="modal-body">
              
            <Row className="mb-4">
                <Col className="mt-1" lg="2">
                    <small className="text-uppercase text-muted font-weight-bold">
                        Password
                    </small>
                </Col>
                <Col md="10">
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            id = "delpassword"
                            placeholder={"  Current password"}
                            type="password"
                            onChange={ () => {}}/>
                    </InputGroup>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col className="mt-1" lg="2">
                    <small className="text-uppercase text-muted font-weight-bold">
                        Confirm Password
                    </small>
                </Col>
                <Col md="10">
                    <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="ni ni-email-83" />
                        </InputGroupText>
                        </InputGroupAddon>
                        <Input
                            id = "confdelpassword"
                            placeholder={"  Confirm password"}
                            type="password"
                            onChange={ () => {}}/>
                    </InputGroup>
                </Col>
            </Row>

          </div>

          <div className="modal-footer">
                <Button color="primary" type="button" onClick={() => delAccount()}>
                  Delete
                </Button>
              <Button
              className="ml-auto"
              color="link"
              data-dismiss="modal"
              type="button"
              onClick={() => setDeleteAccount(false)}
              >
              Close
              </Button>
          </div>
          </Modal>


        </>
    );
}

export default Account;