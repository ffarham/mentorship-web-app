import React, {useState} from 'react';
import {
    Card,
    Row,
    Col,
    Button,
    Input,
    InputGroup,
    InputGroupText,
    InputGroupAddon
} from 'reactstrap';

function Account({data}) {

    // kepp track of whether the user wants to edit the email or not
    const [editEmail, setEditEmail] = useState(false);
    // keep track of whether user wants to change password
    const [changePassword, setChangePassword] = useState(false);

    const [accountDisabled, setAccountDisabled] = useState(true);

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
                            {editEmail
                            ? <Input 
                                placeholder={data.email}
                                type="email"
                                onChange={ () => {}}/>
                            : <Input 
                                disabled
                                placeholder={data.email}
                                type="email"
                                onChange={ () => {}}/>
                            }
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

                <Row className="mb-3">
                    <Col className="mt-1" lg="2">
                        <small className="text-uppercase text-muted font-weight-bold">
                            Password
                        </small>
                    </Col>
                    <Col md="6">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                            </InputGroupAddon>
                            {changePassword
                            ? <Input 
                                placeholder="Current Password"
                                type="password"
                                onChange={ () => {}}/>
                            : <Input 
                            disabled
                            placeholder="Current Password"
                            type="password"
                            onChange={ () => {}}/>
                            }
                        </InputGroup>
                    </Col>
                    <Col md="2"></Col>
                    <Col md="2">
                        <Button 
                            className="btn-1" 
                            color="primary" 
                            outline type="button"
                            onClick={() => setChangePassword(!changePassword)}
                        >
                            Edit
                        </Button>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col className="mt-1" lg="2"/>
                    <Col md="6">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                            </InputGroupAddon>
                            {changePassword
                            ? <Input 
                                placeholder="New Password"
                                type="password"
                                onChange={ () => {}}/>
                            : <Input 
                            disabled
                            placeholder="New Password"
                            type="password"
                            onChange={ () => {}}/>
                            }
                        </InputGroup>
                    </Col>
                    <Col md="4"></Col>
                </Row>

                <Row>
                    <Col className="mt-1" lg="2"/>
                    <Col md="6">
                        <InputGroup className="input-group-alternative">
                            <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                            </InputGroupAddon>
                            {changePassword
                            ? <Input 
                                placeholder="Confirm New Password"
                                type="password"
                                onChange={ () => {}}/>
                            : <Input 
                            disabled
                            placeholder="Confirm New Password"
                            type="password"
                            onChange={ () => {}}/>
                            }
                        </InputGroup>
                    </Col>
                    <Col md="4"></Col>
                </Row>

                <hr/>
                <Row className="mx-2">
                    {accountDisabled
                    ? <Button
                        className="btn-1 ml-1"
                        color="success"
                        outline
                        type="button"
                        >
                        Enable account
                        </Button>
                    : <Button
                    className="btn-1 ml-1"
                    color="danger"
                    outline
                    type="button"
                    >
                        Disable account
                    </Button>
                    }
                    <Button className="btn-1 ml-2" color="danger" type="button">
                        Delete account
                    </Button>
                </Row>
            </div>
        </>
    );
}

export default Account;