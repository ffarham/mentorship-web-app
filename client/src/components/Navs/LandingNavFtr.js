import React from "react";
import { useHistory } from "react-router-dom";

// reactstrap components
import {
  Row
} from "reactstrap";

function LandingNavFtr({ activeView }) {

    let history = useHistory();
     
    return(
        <>

                    <Row className="ftr row-grid align-items-center">
                        <span className="txt3">WHAT ARE YOU WAITING FOR?</span>
                        <button className="button" href="" onClick={() => {history.push("/register")}}>
                            {activeView === "register" ? <span className="text-info">Register</span> : <span className="lgin">Register</span>}
                        </button>
                    </Row>  
        </>
    );
}

export default LandingNavFtr;