// ** React Imports
import React, { Fragment, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

// ** Third Party Components
import { Card, CardHeader, CardText, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Formik } from 'formik';

import { fetchPurchaseInvoice, fetchSalesInvoice }  from '../../../../Services/FirebaseSerice';
import * as Constants from "../../../../UserScreens/Constants.js";

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'


const SalesInvoice= () => {

  const [data,setData] = useState();
  const date = new Date();
  const [salesInvoices,setSalesInvoices] = useState([]);

  useEffect(() => {
    fetchSalesInvoice().then(response => {
      setSalesInvoices(response)
    })
    .catch(() => setInvoiceDetails([]))
    setData(JSON.parse(sessionStorage.getItem("useData")));
  },[])

  const getStateCode = (state) => {
    let index = Constants.states.findIndex(s => s.state_name === state);
    let stateObject = Constants.states[index];
    return stateObject.state_code;
  }

  const ExportJson = (month,year) => {
    let filteredData = salesInvoices.filter(inv => inv.date.split("-")[1] === month && inv.date.split("-")[0] === year);
    let tempArray = [];
    let bcsArray = [];

    filteredData.map(data => {
      let code = getStateCode(data.customer.state)
      if(data.customer.gstin !== ""){
        let index = tempArray.findIndex(inv => data.customer.gstin === inv.ctin);

        let itemsArray = [];
        data.products.map(product => {
          let itemObject = {
            "num": product.product_id,
            "itm_det": {
              "txval": product.product_qty*product.product_price,
              "rt": Number(product.product_Cgst)+Number(product.product_Sgst),
              "camt": ((product.product_Cgst/100)*(product.product_qty*product.product_price)),
              "samt": ((product.product_Sgst/100)*(product.product_qty*product.product_price)),
              "csamt": 0
            }
          }
          itemsArray.push(itemObject);
        })

        let type = "";
        switch(data.invoiceType){
          case "Regular": type = "R";break;
          case "Bill Of Supply": type = "BOS";break;
          case "SEZ Invoice(With IGST)": type = "SEWP";break;
          case "SEZ Invoice(Without IGST)": type = "SEWOP";break;
          default: type = "R"
        }

        let invoiceObject = {
          "inum": data.invoiceNo,
          "idt": data.date,
          "val": data.total+data.tax,
          "pos": code,
          "rchrg": "N",
          "inv_typ": type,
          "itms": itemsArray
        }

        if(index !== -1){
          let customerObject = tempArray[index];
          let invoiceArray = customerObject.inv;
          invoiceArray.push(invoiceObject);
          customerObject.inv = invoiceArray;
        } else {
          let invoiceArray = [];
          invoiceArray.push(invoiceObject);
          tempArray.push({
            "ctin" : data.customer.gstin,
            "inv" : invoiceArray
          })
        }
      } else {
        let bcsObject = {
          "sply_ty": "INTRA",
          "rt": 0,
          "typ": "OE",
          "pos": code,
          "txval": 0,
          "camt": 0,
          "samt": 0,
          "csamt": 0
        }
        bcsArray.push(bcsObject);
      }
    });
    
    let finalJson = {
      "gstin": data.gstin,
      "fp": "062021",
      "version": "GST3.0.4",
      "hash": "hash",
      "b2b": tempArray,
      "b2cs": bcsArray
    }
    
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(finalJson)));
    element.setAttribute('download', "file-export.json");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="">
          <CardTitle tag='h4'>Export JSON</CardTitle>
        </CardHeader>
        <CardText>
        <CardText className="ml-3 mr-3">
          <Formik
              initialValues = {{
                  month: "",
                  year: "",
              }}
          >
          {({
              values,
              handleChange,
          }) => (
          <Form>
              <Row>
                  <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="productName">
                          <Form.Label>Select Month:</Form.Label>
                          <Form.Control
                              as="select"
                              value = {values.month}
                              name = "month"
                              onChange = {handleChange}
                          >
                            <option value = "">Select Month</option>
                            <option key = "jan" value = "01">January</option>
                            <option key = "feb" value = "02">February</option>
                            <option key = "mar" value = "03">March</option>
                            <option key = "apr" value = "04">April</option>
                            <option key = "may" value = "05">May</option>
                            <option key = "jun" value = "06">June</option>
                            <option key = "jul" value = "07">July</option>
                            <option key = "aug" value = "08">August</option>
                            <option key = "sep" value = "09">September</option>
                            <option key = "oct" value = "10">October</option>
                            <option key = "nov" value = "11">November</option>
                            <option key = "dec" value = "12">December</option>
                          </Form.Control>
                      </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Select Year :</Form.Label>
                          <Form.Control 
                              as="select" 
                              value = {values.year}
                              name = "year"
                              onChange = {handleChange}
                          >
                            <option value = "">Select Year</option>
                            <option key = {date.getFullYear()-4} value = {date.getFullYear()-4}>{date.getFullYear()-4}</option>
                            <option key = {date.getFullYear()-3} value = {date.getFullYear()-3}>{date.getFullYear()-3}</option>
                            <option key = {date.getFullYear()-2} value = {date.getFullYear()-2}>{date.getFullYear()-2}</option>
                            <option key = {date.getFullYear()-1} value = {date.getFullYear()-1}>{date.getFullYear()-1}</option>
                            <option key = {date.getFullYear()} value = {date.getFullYear()}>{date.getFullYear()}</option>
                          </Form.Control>
                      </Form.Group>
                  </Col>

                  <Col xs={12} sm={6} md={4} className="d-flex mb-3 justify-content-xs-center justify-content-sm-center justify-content-md-end mt-2">
                      <Button.Ripple
                        name="Export"
                        color="primary"
                        onClick = {() => ExportJson(values.month,values.year)}
                        disabled = {values.month === "" || values.year === ""}
                      >
                        Export
                      </Button.Ripple>
                  </Col>
              </Row>
          </Form>)}
          </Formik>
      </CardText>
      
        </CardText>
      </Card>
    </Fragment>
  )
}

export default SalesInvoice
