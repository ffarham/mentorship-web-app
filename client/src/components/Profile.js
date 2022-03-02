import React, {useState} from 'react';
import {
    Input,
    InputGroup,
    InputGroupText,
    InputGroupAddon,
    Button,
    Row, 
    Col
} from 'reactstrap';

function Profile({data}) {
    
    // keep track of the active department
    // const [activeDepartment, setActiveDepartment] = useState("");

    // // filter the departments by user input
    // const [filteredDepartments, setFilteredDepartments] = useState([]);
    // const handleDepartmentChange = (e) => {
    //     const input = e.target.value;
    //     // if user input is empty, show all
    //     if (input === ""){
    //         setFilteredDepartments(departments);
    //     }else{
    //         const filteredWords = departments.filter((value) => {
    //             return value.includes(input);
    //         });
    //         setFilteredDepartments(filteredWords);
    //     }
    // }

    return(
        <>
            <div className="m-2">
                <Row className="mb-4">
                    <Col>
                        <div className="">
                            <h4 className="display-4 mb-0">User Profile</h4>
                        </div>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="mt-1" sm="2">
                        <small className="text-uppercase text-muted font-weight-bold">
                            Name
                        </small>
                    </Col>
                    <Col sm="6">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="ni ni-circle-08" />
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input 
                                value={data.name}
                                disabled
                                type="text" 
                                onChange={ () => {}}
                            />
                        </InputGroup>
                    </Col>
                    <Col md="2"></Col>
                    <Col md="2">
                        <Button 
                            className="btn-1" 
                            color="primary" 
                            outline type="button"
                        >
                            Edit
                        </Button>
                    </Col>
                </Row>
                

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