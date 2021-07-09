// ** React Import
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { isObjEmpty } from '@utils'

// ** Third Party Components
import { Button } from 'reactstrap'
import { Card, Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import * as Constants from "../../../../UserScreens/Constants";
import * as Yup from "yup";
import { Formik } from 'formik';
import { SetCustomers, UpdateCustomers } from '../../../../Services/FirebaseSerice';

const AddNewCustomer = (props) => {

  const { open, toggleSidebar } = props;
  console.log('props==========>',props)

  const [gstinError,setGstinError] = useState(false);

  const validationScheuma = Yup.object().shape({
      customerName: Yup.string()
          .max(200, "Must be shorter than 200")
          .required("Must Enter Customer Name"),
      gstin: Yup.string()
          .min(15, "Must contain atleast 15 characters")
          .max(15, "Must not be more than 15 characters")
  });

  return (
    <Sidebar
      size='lg'
      open={open}
      title='Add Customer / Vendor'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
    >
        <Row>
        
        <Col >
        <Formik
                initialValues = {props.item ? props.item : 
                {
                    customerName: "",
                    contactPerson: "",
                    contactNo: "",
                    address1: "",
                    address2: "",
                    landmark: "",
                    country: "India",
                    state: "Tamil Nadu",
                    city: "",
                    companyType: "Customer",
                    pincode: "",
                    fax: "",
                    website: "",
                    email: "",
                    registrationType: "Regular",
                    gstin: "",
                    distance: "",
                    licenseNo: "",
                    dueDays: "",
                    shipName: "",
                    shipPhone: "",
                    shipAddress: "",
                    shipCountry: "India",
                    shipState: "Tamil Nadu",
                    shipGstin: "",
                    companyEnable: false
                }}
                validationSchema={validationScheuma}
                onSubmit={async (values,{ setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    let data = {
                        customerName: values.customerName,
                        contactPerson: values.contactPerson,
                        contactNo: values.contactNo,
                        address1: values.address1,
                        address2: values.address2,
                        landmark: values.landmark,
                        country: values.country,
                        state: values.state,
                        city: values.city,
                        companyType: values.companyType,
                        pincode: values.pincode,
                        fax: values.fax,
                        website: values.website,
                        email: values.email,
                        registrationType: values.registrationType,
                        gstin: values.gstin,
                        distance: values.distance,
                        licenseNo: values.licenseNo,
                        dueDays: values.dueDays,
                        shipName: values.shipName,
                        shipPhone: values.shipPhone,
                        shipAddress: values.shipAddress,
                        shipCountry: values.shipCountry,
                        shipState: values.shipState,
                        shipGstin: values.shipGstin,
                        companyEnable: values.companyEnable
                    }
                    if(!props.item){
                        SetCustomers(data).then(res => {
                            setSubmitting(false);
                            props.history.push("/customers")
                        }).catch((error) => {
                            console.log("create customer failed")
                            console.log(error);
                        })
                    } else {
                        UpdateCustomers(data,props.item.id).then(res => {
                            setSubmitting(false);
                            props.history.push("/customers")
                        }).catch((error) => {
                            console.log("create customer failed")
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
                    setFieldError,
                    isSubmitting,
                }) => (
                    <Form>
                        {(touched.customerName && errors.customerName) && <Form.Row>
                            <Form.Label column lg={5} className="pl-2"/>
                            <Col lg={6} md={6}>
                                <div className="form-message text-danger">{errors.customerName}</div> 
                            </Col>
                        </Form.Row>}
                        <Form.Row className="mb-3">
                            <Form.Label column lg={5} className="pl-2">
                                Customer / Vendor Name *
                            </Form.Label>
                            <Col lg={6} md={6}>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter customer vendor name"
                                    name="customerName"
                                    value = {values.customerName}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Contact Person
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control
                            type="text"
                            placeholder="Enter contact person"
                            name="contactPerson"
                            value = {values.contactPerson}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Contact No
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control 
                                type="text" 
                                placeholder="Enter contact no" 
                                value = {values.contactNo}
                                name = {"contactNo"}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Address
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter address 1" 
                            value = {values.address1}
                            name = {"address1"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2"></Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter address 2" 
                            value = {values.address2}
                            name = {"address2"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            LandMark
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter landmark" 
                            value = {values.landmark}
                            name = {"landmark"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Country *
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control 
                                as="select"
                                value = {values.country}
                                name = {"country"}
                                onChange={handleChange}
                            >
                                {Constants.countries.map((item) => (
                                    <option key = {item.code} value = {item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            State *
                        </Form.Label>
                        <Col lg={6} md={6}>
                            {values.country === "India" ?
                                <Form.Control 
                                    as="select"
                                    value = {values.state}
                                    name = {"state"}
                                    onChange={handleChange}
                                >
                                    {Constants.states.map((item) => (
                                        <option key = {item.state_name} value = {item.state_name}>
                                            {item.state_name}
                                        </option>
                                    ))}
                                </Form.Control>
                            : <Form.Control type="text" placeholder="Enter State" />}
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            City
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter city" 
                            value = {values.city}
                            name = {"city"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Company Type *
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control 
                                as="select" 
                                value = {values.companyType}
                                name = {"companyType"}
                                onChange={handleChange}
                            >
                                <option value = "Customer">Customer</option>
                                <option value = "Vendor">Vendor</option>
                                <option value = "Customer/Vendor">Customer/Vendor</option>
                            </Form.Control>
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Pincode
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter pincode" 
                            value = {values.pincode}
                            name = {"pincode"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Fax No
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter fax no" 
                            value = {values.fax}
                            name = {"fax"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Website
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control
                            type="text"
                            placeholder="www.onairbill.com"
                            value = {values.website}
                            name = {"website"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Email
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control
                            type="text"
                            placeholder="emailaddress@domain.com"
                            value = {values.email}
                            name = {"email"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                            <Form.Text className="text-muted">
                            Note: use comma(,) as address seperator to enter multiple
                            Email
                            </Form.Text>
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Registration type *
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control 
                                as="select" 
                                value = {values.registrationType}
                                name = {"registrationType"}
                                onChange={handleChange}
                            >
                                <option value = "Regular">Regular</option>
                                <option value = "Regular-Embassy/UN Body">Regular-Embassy/UN Body</option>
                                <option value = "Regular-SEZ">Regular-SEZ</option>
                                <option value = "Composition">Composition</option>
                                <option value = "Consumer">Consumer</option>
                                <option value = "Unregistered">Unregistered</option>
                            </Form.Control>
                        </Col>
                        </Form.Row>

                        {(touched.gstin && errors.gstin) && <Form.Row>
                            <Form.Label column lg={5} className="pl-2"/>
                            <Col lg={6} md={6}>
                                <div className="form-message text-danger">{errors.gstin}</div> 
                            </Col>
                        </Form.Row>}
                        {(gstinError !== false) && <Form.Row>
                            <Form.Label column lg={5} className="pl-2"/>
                            <Col lg={6} md={6}>
                                <div className="form-message text-danger">{gstinError}</div> 
                            </Col>
                        </Form.Row>}
                        <Form.Row>
                        <Form.Label column lg={5} className="pl-2">
                            GSTIN
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter GSTIN" 
                            value = {values.gstin}
                            name = {"gstin"}
                            onBlur={(e) => {
                                if(e.target.value.length === 15){
                                    Constants.states.map((item) => {
                                        if(item.state_name === values.state){
                                            let code = item.state_code;
                                            let codeFromGstin = e.target.value.slice(0,2) 
                                            if(code !== codeFromGstin){
                                                setGstinError("Invalid GSTIN number")
                                            } else {
                                                setGstinError(false);
                                            }
                                        }
                                    })
                                }
                            }}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>
                        <Form.Row className="mb-3">
                            <Form.Label column lg={5} className="pl-2"/>
                            <Col lg={6} md={6} style = {{textAlign: "end"}}>
                                <a href="https://services.gst.gov.in/services/searchtp" target="_blank">Validate GSTIN</a> 
                            </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Distance for e-way bill (in km)
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control
                            type="text"
                            placeholder="Enter distance for e-way bill (in km)"
                            value = {values.distance}
                            name = {"distance"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            License No
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter license no" 
                            value = {values.licenseNo}
                            name = {"licenseNo"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Due Days
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter due days" 
                            value = {values.dueDays}
                            name = {"dueDays"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                            <Form.Text className="text-muted">
                            Note: use "" to use default due date from settings. Set
                            numeric value from dates from invoice date
                            </Form.Text>
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-4 font-weight-bold">
                            Additonal Shipping Address
                        </Form.Label>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            SHIP Name
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter ship name" 
                            value = {values.shipName}
                            name = {"shipName"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            SHIP Phone
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control
                            type="text"
                            placeholder="Enter SHIP phone no"
                            value = {values.shipPhone}
                            name = {"shipPhone"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            SHIP Address
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control
                            type="text"
                            placeholder="Enter shipping address"
                            value = {values.shipAddress}
                            name = {"shipAddress"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            SHIP Country
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control 
                                as="select"
                                value = {values.shipCountry}
                                onChange={handleChange}
                                name = {"shipCountry"}
                            >
                                {Constants.countries.map((item) => (
                                    <option key = {item.code} value = {item.name}>
                                        {item.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            SHIP state
                        </Form.Label>
                        <Col lg={6} md={6}>
                            {values.country === "India" ?
                                <Form.Control 
                                    as="select"
                                    value = {values.shipState}
                                    onChange={handleChange}
                                    name = {"shipState"}
                                >
                                    {Constants.states.map((item) => (
                                        <option key = {item.state_name} value = {item.state_name}>
                                            {item.state_name}
                                        </option>
                                    ))}
                                </Form.Control>
                            : <Form.Control 
                                type="text" 
                                placeholder="Enter State" 
                                value = {values.shipState}
                                name = {"shipState"}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                />
                            }
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            SHIP GSTIN
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control
                            type="text"
                            placeholder="Enter SHIP GSTIN"
                            value = {values.shipGstin}
                            name = {"shipGstin"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={5} className="pl-2">
                            Company Enable
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Check
                                type="checkbox"
                                label="company will be visible on all the document"
                                checked = {values.companyEnable}
                                name = {"companyEnable"}
                                onChange={handleChange}
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

export default AddNewCustomer;
