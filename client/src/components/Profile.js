import React, {useState} from 'react';
import {
    Input,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Button,
    Row, 
    Col,
    Card,
    Container,
    Modal,
    Badge
} from 'reactstrap';
import api from "../api/api";

function Profile({data}) {

    console.log(data);

    const editBio = () => {

        document.getElementById("bio").style.display = "none";
        document.getElementById("e1").style.display = "";
        document.getElementById("e2").style.display = "";
        document.getElementById("e3").style.display = "";
        document.getElementById("textbox").innerHTML = data.bio;
    }

    const submitChanges = () => {

        document.getElementById("bio").style.display = "";
        document.getElementById("e1").style.display = "none";
        document.getElementById("e2").style.display = "none";
        document.getElementById("e3").style.display = "none";

        const data = {bio: document.getElementById("textbox").value};
        api.post(`/api/v1/bio`, data).then(
            (res) => {
                
            }
      );
        document.getElementById("bio").value = data.bio;
    }
    
    return(
        <>
            <br />
            <div>
                <Row className="justify-content-center">
                    <div className="text-center mt-5">
                        <Col>
                        <img src={require("assets/img/theme/team-4-800x800.jpg")} class="rounded-circle" onClick={e => e.preventDefault()} alt="..." style={{width: "25%"}}/>
                        </Col>
                    </div>
                </Row>

                <div className="text-center mt-5">
                    <h3>
                      {data.name}
                    </h3>
                    <div className="h6 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      {data.department}
                    </div>
                    <div className="h6 font-weight-300">
                      <i className="ni location_pin mr-2" />
                        
                        {data.interests.map( (topic) => (
                            <>
                            <span class="badge badge-pill badge-primary">{topic}</span>
                            <span>  </span>
                            </>
                        ))}       
                    </div>
                  </div>
                  <br id="e3" style={{display: "none"}} />

                <div className="mt-5 py-5 border-top text-center"  id="bio">
                    <Row className="justify-content-center">
                      <Col lg="9">
                        <p>
                            {data.bio}
                        </p>
                        <a href="#pablo" onClick={() => editBio()}>
                          Edit Bio
                        </a>
                      </Col>
                    </Row>
                  </div>

                <Row className="mb-4" style={{display: 'none'}} id="e1">
                    <textarea id="textbox" className="profileform">
                
                    </textarea>
                </Row>
                <Row className="justify-content-center" style={{display: 'none'}} id="e2"> 
                        <a href="#pablo" onClick={() => submitChanges()}>
                               Submit Changes
                        </a>
                </Row>
                <br />
                
                {/* <Row className="mb-4">
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
                        </Row>   */}

            </div>
        </>
    );
}

export default Profile;