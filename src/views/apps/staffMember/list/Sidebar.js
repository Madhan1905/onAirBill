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
import { register, createStaff } from '../../../../Services/FirebaseSerice';

const AddNewStaff = (props) => {
    const history = useHistory();
  const { open, toggleSidebar } = props;
  console.log('props==========>',props)
  
  const validationScheuma = Yup.object().shape({
    name: Yup.string()
        .min(5, "Must be atleast 5 characters long")
        .max(200, "Must be shorter than 200")
        .required("Must Enter user Name"),
    userId: Yup.string()
        .email("Must be a valid email address")
        .min(8, "Must be atleast 8 characters long")
        .max(200, "Must be shorter than 200")
        .required("Must Enter user Id"),
    password: Yup.string()
        .min(6, "Must be atleast 6 characters long")
        .max(200, "Must be shorter than 200")
        .required("Must Enter Password"),
});

  return (
    <Sidebar
      size='lg'
      open={open}
      title='Add Staff'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
    >
        <Row>
        
        <Col >
        <Formik
                    initialValues = {{
                        name: "",
                        userId: "",
                        password: ""
                    }}
                    validationSchema={validationScheuma}
                    onSubmit={async (values,{ setSubmitting, resetForm }) => {
                        register(values.userId,values.password,values.name)
                        .then(() => {
                            createStaff(values.userId,values.name,values.password)
                            .then(() => {
                                console.log("Register Successfull");
                            })
                        }).catch((error) => {
                            console.log("create staff failed")
                            console.log(error);
                        })
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
                        <Form className="mt-5">
                            {(touched.name && errors.name) && 
                            <Form.Row>
                                <Form.Label column lg={5} className="pl-4"/>
                                <Col lg={6} md={6}>
                                    <div className="form-message text-danger">{errors.name}</div> 
                                </Col>
                            </Form.Row>}
                            <Form.Row className="mb-3">
                                <Form.Label column lg={5} className="pl-4">
                                    Staff Name *
                                </Form.Label>
                                <Col lg={6} md={6}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your user name"
                                        value = {values.name}
                                        name = "name"
                                        onChange = {handleChange}
                                        onBlur = {handleBlur}
                                    />
                                </Col>
                            </Form.Row>

                            {(touched.userId && errors.userId) && 
                            <Form.Row>
                                <Form.Label column lg={5} className="pl-4"/>
                                <Col lg={6} md={6}>
                                    <div className="form-message text-danger">{errors.userId}</div> 
                                </Col>
                            </Form.Row>}
                            <Form.Row className="mb-3">
                            <Form.Label column lg={5} className="pl-4">
                                Staff Id *
                            </Form.Label>
                            <Col lg={6} md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your user id"
                                    value = {values.userId}
                                    name = "userId"
                                    onChange = {handleChange}
                                    onBlur = {handleBlur}
                                />
                            </Col>
                            </Form.Row>

                            {(touched.password && errors.password)&& 
                            <Form.Row>
                                <Form.Label column lg={5} className="pl-4"/>
                                <Col lg={6} md={6}>
                                    <div className="form-message text-danger">{errors.password}</div> 
                                </Col>
                            </Form.Row>}
                            <Form.Row className="mb-3">
                            <Form.Label column lg={5} className="pl-4">
                                staff Password *
                            </Form.Label>
                            <Col lg={6} md={6}>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter your password"
                                    value = {values.password}
                                    name = "password"
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
                                    onClick = {() =>  toggleSidebar()}
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

export default AddNewStaff;
