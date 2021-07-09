// ** React Import
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { isObjEmpty } from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { Button } from 'reactstrap'
import { Card, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faChevronLeft
} from "@fortawesome/free-solid-svg-icons";

// ** Store & Actions
import { useDispatch } from 'react-redux'

import * as Yup from "yup";
import { Formik } from 'formik';
import { fetchCustomers, SetPayment, SetProduct,UpdatePayment,UpdateProduct } from '../../../../Services/FirebaseSerice';

const SidebarNewProuct = (props) => {

  const { open, toggleSidebar } = props;
  console.log('props==========>',props)
  const [customers,setCustomers] = useState([])
  const [selectedCustomer,setSelectedCustomer] = useState(props.item  ? props.item :null);

  useEffect(() => {
      fetchCustomers().then(response => setCustomers(response.filter(customer => customer.companyType === "Customer")))
      .catch(() => setCustomers([]))
  },[])


  return (
    <Sidebar
      size='lg'
      open={open}
      title='Add Inward Payment'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
    >
        <Row>
        
        <Col >
          <Formik
                    initialValues = {props.item ? props.item :{
                        receiptNum: "",
                        companyName: "",
                        address: "",
                        gstin: "",
                        paymentDate: "",
                        paymentType: "Cash",
                        amount: "",
                        paymentNote: ""
                    }}

                    onSubmit={async (values,{ setSubmitting, resetForm }) => {
                        setSubmitting(true);
                        let data = {
                            customer: selectedCustomer,
                            receiptNum: values.receiptNum,
                            companyName: values.companyName,
                            address: values.address,
                            gstin: values.gstin,
                            paymentDate: values.paymentDate,
                            paymentType: values.paymentType,
                            amount: values.amount,
                            paymentNote: values.paymentNote
                        }

                        if(!props.item){
                            SetPayment(data,"InwardPayment").then(res => {
                                setSubmitting(false);
                                props.history.push('/inwardPayment')
                            }).catch((error) => {
                                console.log("create transport failed")
                                console.log(error);
                            })
                        } else {
                            UpdatePayment(data,props.item.id,"InwardPayment").then(res => {
                                setSubmitting(false);
                                props.history.push('/inwardPayment')
                            }).catch((error) => {
                                console.log("create transport failed")
                                console.log(error);
                            })
                        }
                        
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <Form>
                            <Form.Row>
                            <Form.Label column lg={4} className="pl-1"/>
                            <Col lg={8} md={8}>
                                <div className="form-message text-danger">{errors.name}</div>
                            </Col>
                            </Form.Row>
                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-1">
                                Recipt No. *
                            </Form.Label>
                            <Col lg={8} md={8}>
                                <Form.Control
                                type="text"
                                placeholder="Enter your receipt no"
                                value = {values.receiptNum}
                                name = "receiptNum"
                                onChange = {handleChange}
                                onBlur = {handleBlur}
                                />
                            </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-1">
                                Company Name
                            </Form.Label>
                            <Col lg={8} md={8}>
                                <Form.Control 
                                    as="select"
                                    value = {selectedCustomer !== null ? selectedCustomer.id : ""}
                                    name = "product"
                                    onChange = {(e) => {
                                        if(customers !== null){
                                            let index = customers.findIndex(c => c.id === e.target.value);
                                            setSelectedCustomer(customers[index]);
                                        }
                                    }}
                                >
                                    {customers.map(customer => (
                                        <option 
                                            key = {customer.id} 
                                            value = {customer.id}
                                        >
                                            {customer.customerName}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-1">
                                Address
                            </Form.Label>
                            <Col lg={8} md={8}>
                                <Form.Control
                                as="textarea"
                                placeholder="Enter your Address"
                                value = {selectedCustomer !== null ? `${selectedCustomer.address1}  ${selectedCustomer.address2}` : ""}
                                name = "address"
                                disabled
                                />
                            </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-1">
                                GSTIN
                            </Form.Label>
                            <Col lg={8} md={8}>
                                {selectedCustomer !== null ? selectedCustomer.gstin : 'N/A'}
                            </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-1">
                                Payment Date
                            </Form.Label>
                            <Col lg={8} md={8}>
                                <Form.Control
                                type="date"
                                placeholder="Enter your payment date"
                                value = {values.paymentDate}
                                name = "paymentDate"
                                onChange = {handleChange}
                                onBlur = {handleBlur}
                                />
                            </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-1">
                                Payment Type
                            </Form.Label>
                            <Col lg={8} md={8}>
                                <Form.Control 
                                    as="select"
                                    value = {values.paymentType}
                                    name = "paymentType"
                                    onChange = {handleChange}
                                >
                                    <option value = "Cash">Cash</option>
                                    <option value = "Cheque">Cheque</option>
                                    <option value = "Online/Transfer">Online/Transfer</option>
                                    <option value = "Bank/Transfer">Bank/Transfer</option>
                                    <option value = "TDS">TDS</option>
                                </Form.Control>
                            </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-1">
                                Amount
                            </Form.Label>
                            <Col lg={8} md={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Amount"
                                    checked = {values.amount}
                                    name = "amount"
                                    onChange = {handleChange}
                                />
                            </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-1">
                                Paymnet Note
                            </Form.Label>
                            <Col lg={8} md={8}>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter Notes" 
                                    value = {values.paymentNote}
                                    name = "paymentNote"
                                    onChange = {handleChange}
                                    onBlur = {handleBlur}
                                />
                            </Col>
                            </Form.Row>
                            <Row md={12}>
                                <Col md={3}></Col>
                                <Col className="d-flex justify-content-start">
                                    <Button.Ripple
                                    color="primary"
                                    name="Save"
                                    onClick = {handleSubmit}
                                    >Save</Button.Ripple>
                                    &nbsp;&nbsp;
                                    <Button.Ripple
                                    color="primary"
                                    name="Back"
                                    onClick = {() => toggleSidebar()}
                                    >Back</Button.Ripple>
                                </Col>
                                </Row>
                        </Form>
                    )}
                </Formik>
            
        </Col>
        
      </Row>
      
          </Sidebar>
  )
}

export default SidebarNewProuct;
