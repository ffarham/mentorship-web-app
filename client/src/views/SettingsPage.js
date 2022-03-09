import React, { useEffect, useState } from "react";
import {
    Container,
    Col,
    Row,
    Nav,
    NavItem,
    NavLink,
    Card
} from 'reactstrap';
import classnames from "classnames";
import MainNavbar from "../components/Navs/MainNavbar.js";
import MainFooter from "../components/Navs/MainFooter.js";
import Profile from "../components/Profile";
import Account from "../components/Account";
import api from "../api/api";

function SettingsPage() {

    // keep track of active tab
    const [activeTab, setActiveTab] = useState("profile");
    const [userData, setUserData] = useState({});

    // get user data 
    const userID = 1;//JSON.parse(localStorage.getItem("authState")).userID;
    useEffect(() => {   
        api.get(`/api/v1/settings/${userID}`).then(
            (res) => {
                if(res.data){
                    console.log(res.data);
                    setUserData(res.data);
                }
            }, 
            (error) => {
                console.log(error);
            }
        );
    }, []);

    return (
        <>
           <MainNavbar activeView="settings" />

            <Container className="m-5" fluid="xl">
                <Row>
                    <Col lg="3">
                        <Card className="bg-secondary shadow border-0 px-2 py-2"> 
                            <Nav
                                className="nav-fill flex-column flex-md-row"
                                id="tabs-icons-text"
                                pills
                                role="tablist"
                            >
                                <Col className="m-2">
                                    <Row className="mb-3">
                                        <NavItem className="">
                                            <NavLink
                                                aria-selected={activeTab === "profile"}
                                                className={classnames("mb-sm-3 mb-md-0", {
                                                    active: activeTab === "profile"
                                                })}
                                                onClick={() => setActiveTab("profile")}
                                                href="#pablo"
                                                role="tab"
                                                >
                                                Profile
                                            </NavLink>
                                        </NavItem>
                                    </Row>

                                    <Row className="mb-3">
                                        <NavItem className="">
                                            <NavLink
                                                aria-selected={activeTab === "account"}
                                                className={classnames("mb-sm-3 mb-md-0", {
                                                    active: activeTab === "account"
                                                })}
                                                onClick={() => setActiveTab("account")}
                                                href="#pablo"
                                                role="tab"
                                                >
                                                Account
                                            </NavLink>
                                        </NavItem>
                                    </Row>

                                    <Row>
                                        <NavItem className="">
                                            <NavLink
                                                aria-selected={activeTab === "form"}
                                                className={classnames("mb-sm-3 mb-md-0", {
                                                    active: activeTab === "form"
                                                })}
                                                onClick={() => setActiveTab("form")}
                                                href="#pablo"
                                                role="tab"
                                                >
                                                Feedback Form
                                            </NavLink>
                                        </NavItem>
                                    </Row>

                                </Col>
                            </Nav>
                        </Card>
                    </Col>   

                    <Col lg="9">
                        <Card className="bg-secondary shadow border-0 px-2 py-2"> 
                            {activeTab === "profile"
                            ? <Profile data={userData}/>
                            : activeTab === "account"
                            ? <Account data={userData}/>
                            : activeTab === "form"
                            ? <p>3</p>
                            : <></>}
                        </Card>
                    </Col>     
                </Row>
            </Container>

            <MainFooter />    
        </>
    );
}

export default SettingsPage;