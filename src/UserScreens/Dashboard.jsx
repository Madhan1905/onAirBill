import React from 'react';
import { Card, Row, Col } from "react-bootstrap";
import Button from "../UserComponents/Button";
import {
  faEdit,
  faArrowDown,
  faArrowUp,
  faTruck,
  faThLarge
} from "@fortawesome/free-solid-svg-icons"; 

//scss
import "./index.scss";

const Dashboard = (props) => {
  return (
    <Card>
        <div className="dashboard d-flex flex-column justify-content-center">
      <Row >
          <Col className="text-center">
      <h1 >Welcome User!</h1>
      </Col>
      </Row>      
      <br />
      <Row>
        <Col md={3}></Col>
        <Col md={6} className="d-flex flex-wrap justify-content-space-around menu-button ml-5">
        <Button
              name="Sales Invoice"
              havingIcon={true}
              iconType={faEdit}
              buttonType="btn btn-primary"
              onClick = {() => props.history.push("/salesinvoice")}
            />
            &nbsp;&nbsp;
            <Button
              name="Purcharse Invoice"
              havingIcon={true}
              iconType={faTruck}
              buttonType="btn btn-primary"
              onClick = {() => props.history.push("/purchaseinvoice")}
            />
            <br />
            <br />
      <Button
              name="Inward Payment"
              havingIcon={true}
              iconType={faArrowDown}
              buttonType="btn btn-primary btn-lg"
              onClick = {() => props.history.push("/inward")}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              name="Outward Payment"
              havingIcon={true}
              iconType={faArrowUp}
              buttonType="btn btn-primary"
              onClick = {() => props.history.push("/outward")}
            />
        </Col>
        <Col md={3}></Col>
      </Row>
      <br />
      <br />
      <Row >
        <Col className="d-flex justify-content-center account-button">
      <Button
              name="Inward Payment"
              havingIcon={true}
              iconType={faThLarge}
              buttonType="btn btn-outline-info"
            />
            </Col>
            </Row>
      </div>
    </Card>
  );
}

export default Dashboard;