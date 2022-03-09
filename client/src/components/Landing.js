/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  CardImg,
  Container,
  Row,
  Col
} from "reactstrap";

//core components
import LandingNav from "./Navs/LandingNav";
import LandingNavFtr from "./Navs/LandingNavFtr";

import MainFooter from "./Navs/MainFooter";

class Landing extends React.Component {
  state = {};
  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }

  render() {
    return (
      <>
        <div className="landing-body">
        <LandingNav />
        <main ref="main">
          <div className="position-relative">
            {/* shape Hero */}
            <section className="section section-lg section-shaped pb-250">

                <div className="dcpRec">
                    <div className="center">
                            <img
                                className="sz anim"
                                alt="Discipulo Logo"
                                src={require("assets/img/LandingPage/Logo/text_logo.png")}
                            />
                    </div>
                </div>
            </section>

            <a class="arrows" href="#Discipulo" ></a>

            {/* 1st Hero Variation */}
          </div>
          <section id="Discipulo" className="rec">
            <Container>
              <Row className="row-grid align-items-center">
              <Col>
                  <div className="text1">
                  DISCIPULO IS A MENTORING SYSTEM DESIGNED TO ASSIST 
                  EXISTING MENTORING PROGRAMS WITHIN A GIVEN SETTING.
                  
                  <CardImg
                    className="pic1"
                      alt="Discipulo Logo"
                      src={require("assets/img/LandingPage/Logo/logo.png")}
                      top
                    />
                    </div>
                  <div className="text2">
                  Discipulo SUPPORTS managing and recording meetings and workshops, 
                  providing feedback and creating plans of action.
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="section section-lg">
            <Container>
              <Row className="row-grid align-items-center">
                <CardImg
                        className="mentee01"
                        alt="Mentee Logo"
                        src={require("assets/img/LandingPage/Icons/mentee01.png")}
                        top
                        />
                    <div className="textbox">
                        <div className="text01">

                        <img
                                className="sz1"
                                alt="Discipulo Logo"
                                src={require("assets/img/LandingPage/Logo/text_logo.png")}
                            />
                        IS DESIGNED FOR BOTH <span className="mtr">MENTOR</span> AND <span className="mnt">MENTEE</span>
                        </div>
                    </div>

                    <CardImg
                        className="mentor01"
                        alt="Mentor Logo"
                        src={require("assets/img/LandingPage/Icons/mentor02.png")}
                        top
                    />

                </Row>
            </Container>
          </section>

          <section>
                <Row className="row-grid align-items-center">

                  <img
                    alt="LoginPage"
                    className="img-fluid floating szlogin"
                    src={require("assets/img/LandingPage/Pages/Log In + Registration/Log In-1.png")}
                  />

                  <div className="txtbox1">
                  <span className="bold">BEAUTIFUL, INTUITIVE USER-FRIENDLY DESIGN</span>
                  <span className="smltext">Discipulo was designed with intuitivity at its heart. 
                  Discipulo makes sure that experience in IT and technology will not affect 
                  accessibility. We encourage everyone to use the system. 
                  A colourful and bright design reflects the values of education, 
                  self-improvement and fun.</span>
                  </div>
                </Row>

                {/* subsection */}
                <Row className="row-grid align-items-center">

                <div className="txtbox2">
                    <span className="bold2">FOR THE MENTEE ...</span>
                    <span className="smltext2"> The learner should always be in the driving seat of their education; they know what they need to learn the most and when they are in the driving seat they will get the most out of the experience. </span>
                </div>

                <img
                    alt="LoginPage"
                    className="img-fluid floating szmentee"
                    src={require("assets/img/LandingPage/Pages/Mentee/Home-1.png")}
                />
                </Row>

                {/* subsection */}
                <Row className="row-grid align-items-center">
                    <img
                    alt="LoginPage"
                    className="img-fluid floating szlogin"
                    src={require("assets/img/LandingPage/Pages/Mentor/Meetings-1.png")}
                    />

                    <div className="txtbox1">
                    <span className="bold">... IN HARMONY WITH THE MENTOR</span>
                    <span className="smltext">The mentee is not the only one who wins in a 
                    mentoring system. Mentors are always surprised in the leadership skills they can develop 
                    and the fresh and unexpected perspectives their mentees can bring.</span>
                    </div>
                </Row>

                {/* footerNavBar */}
                <LandingNavFtr />
            </section>
        </main>
        <MainFooter/>
        </div>
      </>
    );
  }
}

export default Landing;
