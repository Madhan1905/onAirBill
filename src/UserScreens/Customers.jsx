import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Form, Row, Col, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faPrint,
    faList,
    faSave,
    faDownload,
    faChevronLeft,
    faPlus,
    faEdit,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import Button from "../UserComponents/Button";

//scss
import "./index.scss";
import { propTypes } from "react-bootstrap/esm/Image";
import { deleteCustomers, fetchCustomers } from '../Services/FirebaseSerice';
import { Formik } from 'formik';
import LoadingComponent from '../UserComponents/LoadingComponent';

const Customers = () => {
    const history = useHistory()
    const [customerDetails,setCustomerDetails] = useState([]);
    const [filteredCustomers,setFilteredCustomers] = useState([]);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        if(!loading){
            fetchCustomers().then(response => {
                setCustomerDetails(response)
                setFilteredCustomers(response)
            }).catch(() => setCustomerDetails([]))
        }
    },[loading])

    const filterCustomers = (values) => {
        let tempArray = customerDetails.slice();
        if(values.nameQuery !== ""){
            tempArray = tempArray.filter(customer => customer.customerName === values.nameQuery)
        }
        if(values.gstinQuery !== ""){
            tempArray = tempArray.filter(customer => customer.gstin === values.gstinQuery)
        }
        if(values.typeQuery !== ""){
            tempArray = tempArray.filter(customer => customer.companyType === values.typeQuery)
        }

        setFilteredCustomers(tempArray);
    }

    const selectIndex = (index,value) => {
        let tempArray = customerDetails.slice();
        tempArray[index]['selected'] = value;
        setCustomerDetails(tempArray);
    }

    const selectAll = (value) => {
        let tempArray = customerDetails.slice();
        tempArray.map(staff => {
            staff.selected = value
        })
        setCustomerDetails(tempArray);
    }

    const deleteSelected = () => {
        if(window.confirm("Are you sure you want to delete?")){
            setLoading(true);
            let selectedArray = customerDetails.filter(staff => staff.selected === true)
            deleteCustomers(selectedArray)
            .then(() => {
            setLoading(false);
            console.log("delete successfull");
            })
            .catch(error => console.log("Delete failed",error))
        }
    }

    return (
        <div className="screen-stocks">

            <Card className="card-style mb-4">
                <Card.Text className="card-title pb-2">
                    <FontAwesomeIcon icon={faSearch} className="mr-2 mt-3" />
                         Search Customer / Vendor
                </Card.Text>
                <Card.Text className="ml-3 mr-3">
                    <Formik
                        initialValues = {{
                            nameQuery: "",
                            gstinQuery: "",
                            typeQuery: ""
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
                                    <Form.Label>Search By Name :</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Select Cusomer/Vendor"
                                        value = {values.nameQuery}
                                        name = "nameQuery"
                                        onChange = {handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6} md={3} >
                                <Form.Group controlId="stocksMin">
                                    <Form.Label>Get By GSTIN :</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Search GSTIN"
                                        value = {values.gstinQuery}
                                        name = "gstinQuery"
                                        onChange = {handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6} md={3} >
                                <Form.Group controlId="stocksMin">
                                    <Form.Label>Get By GSTIN :</Form.Label>
                                    <Form.Control 
                                        as="select" 
                                        value = {values.typeQuery}
                                        name = "typeQuery"
                                        onChange = {handleChange}
                                    >
                                        <option value = "default">Select By CompanyType</option>
                                        <option value = "Customer/Vendor">Customer/Vendor</option>
                                        <option value = "Customer">Customer</option>
                                        <option value = "Vendor">Vendor</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={12} sm={6} md={3} className="d-flex mb-3 justify-content-xs-center justify-content-sm-center justify-content-md-end mt-4">
                                <Button
                                    name="Search"
                                    havingIcon={true}
                                    iconType={faSearch}
                                    buttonType="btn btn-primary"
                                    onClick = {() => filterCustomers(values)}
                                />
                                &nbsp;&nbsp;
                                <Button
                                    name="Show All Data"
                                    havingIcon={true}
                                    iconType={faList}
                                    buttonType="btn btn-primary"
                                    onClick = {() => setFilteredCustomers(customerDetails)}
                                />
                            </Col>
                        </Row>
                    </Form>)}
                    </Formik>
                </Card.Text>
            </Card>

            <Card className="card-style mb-4">
                <Card.Text className="card-title pb-2 d-flex justify-content-between m-0">
                    <div>
                        <FontAwesomeIcon icon={faList} className="mr-2 mt-3" />
            Customer / Vendor List
          </div>
                    <div className="d-flex justify-content-end align-items-end">
                        <Button
                            name="Add New"
                            havingIcon={true}
                            iconType={faPlus}
                            buttonType="btn btn-primary"
                            onClick={() => history.push("/addcustomer")}
                        />
                    </div>
                </Card.Text>
                <Card.Text>
                    <Table bordered striped hover responsive="sm" className="mb-0">
                        <thead>
                            <tr>
                                <th >
                                    <input 
                                        type="checkbox" 
                                        onChange = {(e) => selectAll(e.target.checked)}
                                    />
                                </th>
                                <th className="green-text">CUSTOMER /VERDOR NAME</th>
                                <th>OUTSTANDING PAYMENT</th>
                                <th className="green-text">CONTACT NUMBER</th>
                                <th className="green-text">COMPANY TYPE</th>
                                <th className="green-text">STATE</th>
                                <th className="green-text">STATUS</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((item,index) => {
                                    return (
                                        <tr key = {index}>
                                            <td>
                                                <Form.Check 
                                                    type="checkbox" 
                                                    className="m-0" 
                                                    onChange = {() => selectIndex(index,!item.selected)}
                                                    checked = {item.selected}
                                                />
                                            </td>
                                            <td>{item.customerName}</td>
                                            <td>Get Outstanding Payment</td>
                                            <td>{item.contactNo}</td>
                                            <td>{item.companyType}</td>
                                            <td>{item.state}</td>
                                            <td><a href = "">Active</a></td>
                                            <td><Button
                                                name="Edit"
                                                havingIcon={true}
                                                iconType={faEdit}
                                                buttonType="btn btn-outline-dark btn-light"
                                                onClick = {() => {
                                                    history.push({
                                                        pathname: '/addcustomer',
                                                        state: { customerValues: {...item,docId: item.id} }
                                                    })
                                                }}
                                            /></td>

                                        </tr>
                                    );
                                })
                            ) : (
                                    <tr>
                                        <td colSpan="6"><div className="d-flex justify-content-center">No results</div></td>
                                    </tr>
                                )}
                        </tbody>
                    </Table>
                </Card.Text>
            </Card>
            {customerDetails.length > 0 && (
                <Card className="card-style mb-4">
                    <Card.Text className="card-title pb-4 pt-4">
                        <div className="d-flex justify-content-between">
                            <div>
                                <Button
                                    name="Delete"
                                    havingIcon={true}
                                    iconType={faTrash}
                                    buttonType="btn btn-danger"
                                    onClick = {() => {deleteSelected()}}
                                />
                            </div>
                            &nbsp;&nbsp;

                        <div className="d-flex">
                            <Button
                                    name="Add New"
                                    havingIcon={true}
                                    iconType={faPlus}
                                    buttonType="btn btn-primary"
                                    onClick={() => history.push("/addcustomer")}
                                />

                            </div>
                        </div>
                    </Card.Text>
                </Card>
            )}
            {loading && <LoadingComponent/>}
        </div>
    );
}

export default Customers;
