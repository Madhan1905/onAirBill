import React from 'react';
import { Card, Row, Col, Form } from "react-bootstrap";
import { Label,Input } from 'reactstrap'
import Button from "./Button";
import {
    faEdit,
    faSave,
    faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import * as Constants from "../UserScreens/Constants";

const ProductComponent = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    toggleSidebar,
}) => {
    return(
        <Form>
            {(touched.name && errors.name) &&<Form.Row>
            <Form.Label column lg={4} />
            <Col lg={8} md={8}>
                <div className="form-message text-danger">{errors.name}</div>
            </Col>
            </Form.Row>}
            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Name *
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control
                type="text"
                placeholder="Enter your product name"
                value = {values.name}
                name = "name"
                onChange = {handleChange}
                onBlur = {handleBlur}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Product Note
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control 
                    as="textarea" 
                    value = {values.note}
                    name = "note"
                    onChange = {handleChange}
                    onBlur = {handleBlur}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                HSN / SAC CODE
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control
                type="text"
                placeholder="Enter your HSN / SAC code"
                value = {values.hsnCode}
                name = "hsnCode"
                onChange = {handleChange}
                onBlur = {handleBlur}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Unit of measurement
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control 
                    as="select"
                    value = {values.unit}
                    name = "unit"
                    onChange = {handleChange}
                >
                    {Constants.measurementUnits.map(unit => (
                        <option value = {unit.id} key = {unit.id}>
                            {unit.name}
                        </option>
                    ))}
                </Form.Control>
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Stock Available
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control
                type="text"
                placeholder="Enter your stock available"
                value = {values.stock}
                name = "stock"
                onChange = {handleChange}
                onBlur = {handleBlur}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Product *
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control 
                    as="select"
                    value = {values.product}
                    name = "product"
                    onChange = {handleChange}
                >
                    <option value = "Taxable">Taxable</option>
                    <option value = "Nill Rated">Nill Rated</option>
                    <option value = "Exempt">Exempt</option>
                    <option value = "Non-GST">Non-GST</option>
                </Form.Control>
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                No ITC
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Check
                type="checkbox"
                label="Is product eligible for input credit"
                checked = {values.isItc}
                name = "isItc"
                onChange = {handleChange}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                IGST %
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control 
                    as="select" 
                    placeholder="Enter your IGST" 
                    value = {values.IGST}
                    name = "IGST"
                    onChange = {(e) => {
                        setFieldValue("IGST",e.target.value)
                        setFieldValue("CGST",e.target.value/2)
                        setFieldValue("SGST",e.target.value/2)
                        if(values.sellPrice){
                            let price  = Number(values.sellPrice);
                            let taxPrice = price + (price*Number(e.target.value)*0.01)
                            setFieldValue("sellPrice",price)
                            setFieldValue("sellPriceWithTax", Number(taxPrice).toFixed(2))
                        }
                        if(values.purchasePrice){
                            let price  = Number(values.purchasePrice);
                            let taxPrice = price + (price*Number(e.target.value)*0.01)
                            setFieldValue("purchasePrice",price)
                            setFieldValue("purchasePriceWithTax", Number(taxPrice).toFixed(2))
                        }
                    }}
                    onBlur = {handleBlur}
                >
                    <option value = {0}>0%</option>
                    <option value = {0.1}>0.1%</option>
                    <option value = {0.25}>0.25%</option>
                    <option value = {1}>1%</option>
                    <option value = {1.5}>1.5%</option>
                    <option value = {3}>3%</option>
                    <option value = {5}>5%</option>
                    <option value = {7.5}>7.5%</option>
                    <option value = {12}>12%</option>
                    <option value = {18}>18%</option>
                    <option value = {28}>28%</option>
                </Form.Control>
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                CGST %
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control 
                    as="select"  
                    placeholder="Enter your CGST" 
                    value = {values.CGST}
                    name = "CGST"
                    onChange = {(e) => {
                        setFieldValue("IGST",e.target.value*2)
                        setFieldValue("CGST",e.target.value)
                        setFieldValue("SGST",e.target.value)
                        if(values.sellPrice){
                            let price  = Number(values.sellPrice);
                            let taxPrice = price + (price*Number(e.target.value*2)*0.01)
                            setFieldValue("sellPrice",price)
                            setFieldValue("sellPriceWithTax", Number(taxPrice).toFixed(2))
                        }
                        if(values.purchasePrice){
                            let price  = Number(values.purchasePrice);
                            let taxPrice = price + (price*Number(e.target.value*2)*0.01)
                            setFieldValue("purchasePrice",price)
                            setFieldValue("purchasePriceWithTax", Number(taxPrice).toFixed(2))
                        }
                    }}
                    onBlur = {handleBlur}
                >
                    <option value = {0}>0%</option>
                    <option value = {0.05}>0.05%</option>
                    <option value = {0.125}>0.125%</option>
                    <option value = {0.5}>0.5%</option>
                    <option value = {0.75}>0.75%</option>
                    <option value = {1.5}>1.5%</option>
                    <option value = {2.5}>2.5%</option>
                    <option value = {3.75}>3.75%</option>
                    <option value = {6}>6%</option>
                    <option value = {9}>9%</option>
                    <option value = {14}>14%</option>
                </Form.Control>
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                SGST %
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control 
                    as="select"  
                    placeholder="Enter your SGST" 
                    value = {values.SGST}
                    name = "SGST"
                    onChange = {(e) => {
                        setFieldValue("IGST",e.target.value*2)
                        setFieldValue("CGST",e.target.value)
                        setFieldValue("SGST",e.target.value)
                        if(values.sellPrice){
                            let price  = Number(values.sellPrice);
                            let taxPrice = price + (price*Number(e.target.value*2)*0.01)
                            setFieldValue("sellPrice",price)
                            setFieldValue("sellPriceWithTax", Number(taxPrice).toFixed(2))
                        }
                        if(values.purchasePrice){
                            let price  = Number(values.purchasePrice);
                            let taxPrice = price + (price*Number(e.target.value*2)*0.01)
                            setFieldValue("purchasePrice",price)
                            setFieldValue("purchasePriceWithTax", Number(taxPrice).toFixed(2))
                        }
                    }}
                    onBlur = {handleBlur}
                >
                    <option value = {0}>0%</option>
                    <option value = {0.05}>0.05%</option>
                    <option value = {0.125}>0.125%</option>
                    <option value = {0.5}>0.5%</option>
                    <option value = {0.75}>0.75%</option>
                    <option value = {1.5}>1.5%</option>
                    <option value = {2.5}>2.5%</option>
                    <option value = {3.75}>3.75%</option>
                    <option value = {6}>6%</option>
                    <option value = {9}>9%</option>
                    <option value = {14}>14%</option>
                </Form.Control>
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                CESS Amount
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control
                type="text"
                placeholder="Enter your CESS Amount"
                value = {values.CESS}
                name = "CESS"
                onChange = {handleChange}
                onBlur = {handleBlur}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Sell Price
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control
                type="text"
                placeholder="Enter your sell price"
                value = {values.sellPrice}
                name = "sellPrice"
                onChange = {(e) => {
                    let price  = Number(e.target.value);
                    let taxPrice = price + (price*Number(values.IGST)*0.01)
                    setFieldValue("sellPrice",e.target.value)
                    setFieldValue("sellPriceWithTax", (taxPrice).toFixed(2))
                }}
                onBlur = {handleBlur}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Sell Price (Incl. Tax)
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control
                type="text"
                placeholder="Enter your ell price (Incl. Tax)"
                value = {values.sellPriceWithTax}
                name = "sellPriceWithTax"
                onChange = {(e) => {
                    let price  = e.target.value;
                    let taxPrice = price /  ((Number(values.IGST)*0.01) + 1)
                    setFieldValue("sellPriceWithTax",e.target.value)
                    setFieldValue("sellPrice", (taxPrice).toFixed(2))
                }}
                onBlur = {handleBlur}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Purcharse Price
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control
                type="text"
                placeholder="Enter you purcharse price"
                value = {values.purchasePrice}
                name = "purchasePrice"
                onChange = {(e) => {
                    let price  = Number(e.target.value);
                    let taxPrice = price + (price*Number(values.IGST)*0.01)
                    setFieldValue("purchasePrice",e.target.value)
                    setFieldValue("purchasePriceWithTax", (taxPrice).toFixed(2))
                }}
                onBlur = {handleBlur}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Purcharse Price (Incl Tax)
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Control
                type="text"
                placeholder="Enter you purcharse price (Incl Tax)"
                value = {values.purchasePriceWithTax}
                name = "purchasePriceWithTax"
                onChange = {(e) => {
                    let price  = e.target.value;
                    let taxPrice = price /  ((Number(values.IGST)*0.01) + 1)
                    setFieldValue("purchasePriceWithTax",e.target.value)
                    setFieldValue("purchasePrice", (taxPrice).toFixed(2))
                }}
                onBlur = {handleBlur}
                />
            </Col>
            </Form.Row>

            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Service Item
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Check
                type="checkbox"
                label="Check if it is service, EX- computer service, Consulting services(No stock Count)"
                checked = {values.isServiceItem}
                name = "isServiceItem"
                onChange = {handleChange}
                />
            </Col>
            </Form.Row>
            <Form.Row className="mb-3">
            <Form.Label column lg={4} >
                Product Enable
            </Form.Label>
            <Col lg={8} md={8}>
                <Form.Check
                type="checkbox"
                label="Product will be visible on all the document"
                checked = {values.isProductEnable}
                name = "isProductEnable"
                onChange = {handleChange}
                />
            </Col>
            </Form.Row>

            <Row md={12}>
                <Col md={3}></Col>
                <Col className="d-flex justify-content-start">
                    <Button
                    name="Save"
                    havingIcon={true}
                    iconType={faSave}
                    buttonType="btn btn-primary"
                    onClick = {handleSubmit}
                    />
                    &nbsp;&nbsp;
                    <Button
                    name="Back"
                    havingIcon={true}
                    iconType={faChevronLeft}
                    buttonType="btn btn-outline-dark btn-light"
                    onClick = {() => toggleSidebar()}
                    />
                </Col>
                </Row>
        </Form>
    )
}

export default ProductComponent