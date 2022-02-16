import React from "react";
import {
    Card,
    Row
} from "reactstrap";

function Meeting({meeting}){

    const {id, name, time, location, duration, description} = meeting;

    return(
        <>
            <Card>
                <Row>
                    <p>{name}</p>
                    <p>{time}</p>
                </Row>
            </Card>
        </>
    );
}

export default Meeting;