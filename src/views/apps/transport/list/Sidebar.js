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
import { SetTransport, UpdateTransport } from '../../../../Services/FirebaseSerice';

const SidebarNewTransport = (props) => {

  const { open, toggleSidebar } = props;
  console.log('props==========>',props)


  const validationScheuma = Yup.object().shape({
    transportName: Yup.string()
        .max(200, "Must be shorter than 200")
        .required("Must Enter Transport Name"),
});

  return (
    <Sidebar
      size='lg'
      open={open}
      title='Add New Transport'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
    >
        <Row>
        
        <Col >
        <Formik
                    initialValues = {props.item ? props.item : {
                        transportName: "",
                        transportId: "",
                        vehicleNo: ""
                    }}
                    validationSchema={validationScheuma}
                    onSubmit={async (values,{ setSubmitting, resetForm }) => {
                        setSubmitting(true);
                        let data = {
                            transportName: values.transportName,
                            transportId: values.transportId,
                            vehicleNo: values.vehicleNo
                        }

                        if(!props.item){
                            SetTransport(data).then(res => {
                                setSubmitting(false);
                                props.history.push("/transport")
                            }).catch((error) => {
                                console.log("create transport failed")
                                console.log(error);
                            })
                        } else {
                            UpdateTransport(data,props.item.id).then(res => {
                                setSubmitting(false);
                                props.history.push("/transport")
                            }).catch((error) => {
                                console.log("update transport failed")
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
                        <Form className="mt-5">
                            {errors.transportName && 
                            <Form.Row>
                                <Form.Label column lg={4} className="pl-2"/>
                                <Col lg={8} md={8}>
                                    <div className="form-message text-danger">{errors.transportName}</div> 
                                </Col>
                            </Form.Row>}
                            <Form.Row className="mb-3">
                                <Form.Label column lg={4} className="pl-2">
                                    Transport Name *
                                </Form.Label>
                                <Col lg={8} md={8}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your transport name"
                                        value = {values.transportName}
                                        name = "transportName"
                                        onChange = {handleChange}
                                        onBlur = {handleBlur}
                                    />
                                </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-2">
                                Transport Id
                            </Form.Label>
                            <Col lg={8} md={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your transport id"
                                    value = {values.transportId}
                                    name = "transportId"
                                    onChange = {handleChange}
                                    onBlur = {handleBlur}
                                />
                            </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={4} className="pl-2">
                                Vehicle No
                            </Form.Label>
                            <Col lg={8} md={8}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your vehicle no"
                                    value = {values.vehicleNo}
                                    name = "vehicleNo"
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
                                    onClick = {() => window.history.back()}
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

export default SidebarNewTransport;
