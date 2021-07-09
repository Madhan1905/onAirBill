import React from 'react';
import { Card } from "react-bootstrap";
import './index.scss';
import { CardBody, CardText } from 'reactstrap';
const CardDesign = props => {
    const { icon, header, content, id, type } = props.item;
    const cardAlign = (header) => {
        if(type === 'gst') {
        if(header === "GST Invoices") {
            return 'gst';
        } else if(header === "Product & Stock") {
            return 'product';
        } else if(header === "Staff Account") {
            return 'staff';
        } else {
            return 'payment';
        }
    }
    }
    return (
        <Card className={`${cardAlign(header)} ${type === 'gst' ? 'gst-card' : 'info-card'}`}>
            <CardText>
                <img src={icon} className={`${header === "GST Invoices" && "file-img"} img-icon `} center />
                <br />
                <div className="header">{header}</div>
                <br />
                <div className="content">{content}</div>
            </CardText>
        </Card>
    )
}

export default CardDesign;
