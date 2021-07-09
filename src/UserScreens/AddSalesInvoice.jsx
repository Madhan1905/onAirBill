import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faChevronLeft,
  faListAlt,
  faPlus,
  faMinus
} from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import * as Constants from "./Constants";
import * as Yup from "yup";
import Button from "../UserComponents/Button";
import { fetchCustomers, fetchProducts, fetchTransports, SetSalesInvoice, UpdateProductStock, UpdateSalesInvoice, SetCustomers, UpdateCustomers, SetProduct, fetchSearchResult } from '../Services/FirebaseSerice';
import "./index.scss";
import ProductComponent from '../UserComponents/ProductComponent';
import { ToWords } from 'to-words';

const AddSalesInvoice = (props) => {
    const [customerId,setCustomerId] = useState("default");
    const [customerDetails,setCustomerDetails] = useState([]);
    const [selectedCustomer,setSelectedCustomer] = useState((props.location.state.customerValues && props.location.state.customerValues.customer) ? props.location.state.customerValues.customer :null);
    const [transport,setTransport] = useState((props.location.state.customerValues && props.location.state.customerValues.transport) ? props.location.state.customerValues.transport :{});
    const [transportName,setTransportName] = useState("");
    const [transports,setTransports] = useState([]);
    const [showtransportDropdown,setShowtransportDropdown] = useState(false);
    const [productName,setProductName] = useState((props.location.state.customerValues && props.location.state.customerValues.productName) ? props.location.state.customerValues.productName :"");
    const [products,setProducts] = useState([]);
    const [selectedProducts,setSelectedProducts] = useState((props.location.state.customerValues && props.location.state.customerValues.products) ? props.location.state.customerValues.products
    : [{
        product_id: "",
        productName: "",
        product_sacCode: "",
        product_qty: "",
        product_price: "",
        product_discount: "",
        product_Igst: "",
        product_Cgst: "",
        product_Sgst: "",
        product_cessPercent: "",
        product_cessAmount: ""
    }] );
    const [showproductDropdown,setShowproductDropdown] = useState(false);
    const [showError,setShowError] = useState({customer:false,product: false});
    const [editing,setEditing] = useState(false);
    const [showcustomerModal,setShowCustomerModal] = useState(false);
    const [showProductModal,setShowProductModal] = useState(false);
    const [invoiceNumError,setInvoiceNumError] = useState(false);
    const [selectedArithmetic,setSelectedArithmetic] = useState((props.location.state.customerValues && props.location.state.customerValues.roundoffType) ? props.location.state.customerValues.roundoffType : "plus");
    const stateOfUser = JSON.parse(sessionStorage.getItem("useData")).state;

    const toWords = new ToWords({
        localeCode: 'en-IN',
        converterOptions: {
          currency: true,
          ignoreDecimal: false,
          ignoreZeroCurrency: false,
        }
      });

    useEffect(() => {
        fetchTransports().then(response => setTransports(response))
            .catch(() => setTransports([]))
    },[])

    // useEffect(() => {
    //     fetchProducts().then(response => setProducts(response))
    //         .catch(() => setProducts([]))
    // },[showProductModal])

    useEffect(() => {
        fetchCustomers().then(response => setCustomerDetails(response.filter(customer => (customer.companyType === "Customer" || customer.companyType === "Customer/Vendor"))))
        .catch(() => setCustomerDetails([]))
    },[showcustomerModal])

    const validationScheuma = Yup.object().shape({
        customerName: Yup.string()
            .max(200, "Must be shorter than 200")
            .required("Must Enter Customer Name")
    });
    
    const productScheuma = Yup.object().shape({
        name: Yup.string()
        .max(200, "Must be shorter than 200")
        .required("Must Enter Product Name"),
    });

    const invoiceSchema = Yup.object().shape({
        invoiceNo: Yup.string()
            .required("Must Enter Invoice Number")
    })

    const setProductDetails = (index,type,value) => {
        let tempArray = selectedProducts.slice();
        tempArray[index][type] = value;
        console.log(tempArray)

        setSelectedProducts(tempArray);
    }

    const getToday = () => {
        let date = new Date();
        let dateString = date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" : "") +(date.getMonth() + 1) + "-" + (date.getDate() < 10 ? "0" : "") + date.getDate();
        return dateString;
    }

    const getTotal = (roundOff) => {
        let total = (selectedProducts.reduce((a,b) => a + ((b.product_Igst/100)*(b.product_price*b.product_qty)
        + (b.product_Cgst/100)*(b.product_price*b.product_qty)
        + (b.product_Sgst/100)*(b.product_price*b.product_qty)
        +(b.product_price*b.product_qty) || 0),0)).toFixed(2)

        if(roundOff) {
            roundOff = Number(roundOff)
            total = Number(total)
            if(selectedArithmetic === "plus") {
                total += roundOff
            } else {
                total -= roundOff
            }
            total = total.toFixed(2)
        } 
        return total;
    }
    
  return (
    <div className="screen-stocks">
      <Row>
        <Col>
          <Card className="card-style mb-4">
            <Card.Text className="card-title pb-2 pl-4">
              <FontAwesomeIcon icon={faEdit} className="mr-2 mt-3" />
              SALE INVOICE
            </Card.Text>
            <Card.Text className="ml-2 mr-2">
                <Formik
                    initialValues = {props.location.state.customerValues ? props.location.state.customerValues :{
                        date: getToday(),
                        revCharge: "No",
                        sameAsShipping: true,
                        shipName: "",
                        shipPhone: "",
                        shipAddress: "",
                        shipCountry: "India",
                        shipState: "Tamil Nadu",
                        shipGstin: "",
                        placeOfSupply: "",
                        invoiceType: "Regular",
                        invoiceNo: (JSON.parse(sessionStorage.getItem("invoices")).length > 0 ? Math.max.apply(Math, JSON.parse(sessionStorage.getItem("invoices")).map(inv => Number(inv.invoiceNo))) + 1 : 1),
                        challanNo: "",
                        challanDate: "",
                        poNo: "",
                        poDate: "",
                        lrNo: "",
                        ewayNo: "",
                        product_id: "",
                        product_sacCode: "",
                        product_qty: "",
                        product_price: "0",
                        product_discount: "",
                        product_Igst: "",
                        product_Cgst: "",
                        product_Sgst: "",
                        product_cessPercent: "",
                        product_Total: 0,
                        //product_cessAmount: "",
                        dueDate: "",
                        Bank: "",
                        paymentType: "Cash",
                        paymentNote: "",
                        terms: "Subject to our home Jurisdiction.\nOur Responsibility Ceases as soon as goods leaves our Premises.\nGoods once sold will not taken back.\nDelivery Ex-Premises.",
                        remarks: "",
                        roundoff: ""
                    }}
                    validationSchema = {invoiceSchema}
                    onSubmit={async (values,{ setSubmitting, resetForm }) => {
                        setSubmitting(true);
                        if(selectedProducts[0].productName === "" || selectedCustomer === null || invoiceNumError){
                            let errorObj = {product: selectedProducts[0].product_id === "",customer: selectedCustomer === null}
                            setShowError(errorObj)
                        } else {
                            let data = {
                                customer: selectedCustomer,
                                date: values.date,
                                revCharge: values.revCharge,
                                sameAsShipping: values.sameAsShipping,
                                shipName: values.shipName,
                                shipPhone: values.shipPhone,
                                shipAddress: values.shipAddress,
                                shipCountry: values.shipCountry,
                                shipState: values.shipState,
                                shipGstin: values.shipGstin,
                                placeOfSupply: values.placeOfSupply,
                                invoiceType: values.invoiceType,
                                invoiceNo: values.invoiceNo,
                                challanNo: values.challanNo,
                                challanDate: values.challanDate,
                                poNo: values.poNo,
                                poDate: values.poDate,
                                lrNo: values.lrNo,
                                ewayNo: values.ewayNo,
                                products: selectedProducts,
                                // productName: productName,
                                // transport: transport,
                                // product_sacCode: values.product_sacCode,
                                // product_qty: values.product_qty,
                                // product_price: values.product_price,
                                // product_discount: values.product_discount,
                                // product_Igst: values.product_Igst,
                                // product_Cgst: values.product_Cgst,
                                // product_Sgst: values.product_Sgst,
                                // product_cessPercent: values.product_cessPercent,
                                // product_cessAmount: "",
                                dueDate: values.dueDate,
                                //Bank: values.Bank,
                                paymentType: values.paymentType,
                                paymentNote: values.paymentNote,
                                terms: values.terms,
                                remarks: values.remarks,
                                tax: selectedProducts.reduce((a,b) => a + ((b.product_Igst/100)*(b.product_price*b.product_qty)
                                    + (b.product_Cgst/100)*(b.product_price*b.product_qty)
                                    + (b.product_Sgst/100)*(b.product_price*b.product_qty) || 0), 0),
                                total: selectedProducts.reduce((a, b) => a + ((b.product_price*b.product_qty) || 0), 0),
                                remaining: 0,
                                roundoff: values.roundoff,
                                roundoffType: selectedArithmetic
                            }
                            
                            selectedProducts.map(selectedProduct => {
                                if(selectedProduct.product_id !== "") {
                                    let newStock = Number(selectedProduct.stock) - Number(selectedProduct.product_qty);
                                    console.log("new stock",newStock)
                                    console.log("values.product_id",selectedProduct.product_id)
                                    UpdateProductStock(newStock,selectedProduct.product_id)
                                }
                            })
    
                            if(!props.location.state.customerValues){ 
                                SetSalesInvoice(data).then(res => {
                                    setSubmitting(false);
                                    props.history.push("/salesinvoice")
                                }).catch((error) => {
                                    console.log("create sales failed")
                                    console.log(error);
                                })
                            } else {
                                UpdateSalesInvoice(data,props.location.state.customerValues.docId).then(res => {
                                    setSubmitting(false);
                                    props.history.push("/salesinvoice")
                                }).catch((error) => {
                                    console.log("create customer failed")
                                    console.log(error);
                                })
                            }
                        }
                        
                    }}
                >
                    {({
                        values,
                        setFieldValue,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <Form>
                            <Row>
                            <Col md={5}>
                                <Card className="card-style mb-4 add-sales-invoice">
                                <Card.Text className="card-title pb-2 pl-2">
                                    <FontAwesomeIcon
                                    icon={faListAlt}
                                    className="mr-2 mt-3"
                                    />
                                    Customer Information
                                </Card.Text>
                                <Card.Text>
                                    <Form.Row className="mb-3 mr-4">
                                    <Col
                                        lg={12}
                                        md={12}
                                        className="d-flex justify-content-end"
                                    >
                                        <Button
                                        name="Add New Customer"
                                        havingIcon={true}
                                        iconType={faPlus}
                                        buttonType="btn btn-primary"
                                        onClick={() => setShowCustomerModal(true)}
                                        />
                                    </Col>
                                    </Form.Row>

                                    {/* {showError && <Form.Row>
                                        <Form.Label column lg={3} className="pl-4"/>
                                        <Col lg={8} md={8}>
                                            <div className="form-message text-danger">Please Select Customer</div>
                                        </Col>
                                    </Form.Row>} */}

                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={3} className="pl-4">
                                        M / S
                                    </Form.Label>
                                    <Col lg={8} md={8}>
                                        <Form.Control 
                                            as="select" 
                                            value = {customerId}
                                            name = "customerId"
                                            value = {selectedCustomer !== null && selectedCustomer.id}
                                            onChange={(e) => {
                                                setCustomerId(e.target.value);
                                                if(customerDetails !== null){
                                                    if(e.target.value === "default"){
                                                        setSelectedCustomer(null);
                                                        setFieldValue("placeOfSupply","")
                                                    } else {
                                                        let index = customerDetails.findIndex(c => c.id === e.target.value);
                                                        setSelectedCustomer(customerDetails[index]);
                                                        setFieldValue("placeOfSupply",customerDetails[index].state)
                                                    }
                                                }
                                            }}
                                        >
                                            <option value = "default">Select Customer</option>
                                            {customerDetails.map(customer => {
                                                return(
                                                    <option key = {customer.id} value = {customer.id}>
                                                        {customer.customerName}
                                                    </option>
                                                )
                                        })}
                                        </Form.Control>
                                    </Col>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={3} className="pl-4">
                                        Address
                                    </Form.Label>
                                    <Col lg={8} md={8}>
                                        <Form.Control as="textarea" disabled value = {selectedCustomer !== null ? selectedCustomer.address1+selectedCustomer.address2 : ""}/>
                                    </Col>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={3} className="pl-4">
                                        PHONE NO
                                    </Form.Label>
                                    <Col lg={8} md={8}>
                                        {selectedCustomer !== null ? selectedCustomer.contactNo : 'N / A'}
                                    </Col>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={3} className="pl-4">
                                        GSTIN
                                    </Form.Label>
                                    <Col lg={8} md={8}>
                                        {selectedCustomer !== null ? selectedCustomer.gstin : 'N / A'}
                                    </Col>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={3} className="pl-4">
                                        Rev. Charge
                                    </Form.Label>
                                    <Col lg={8} md={8}>
                                        <Form.Control as="select" value = {values.revCharge} disabled = {selectedCustomer !== null}>
                                            <option value = {"No"}>No</option>
                                            <option value = {"Yes"}>Yes</option>
                                        </Form.Control>
                                    </Col>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={3} className="pl-4">
                                        Shipping Address
                                    </Form.Label>
                                    <Col lg={8} md={8}>
                                        <Form.Check
                                            type="checkbox"
                                            label="Use Same Shipping Address"
                                            checked = {values.sameAsShipping}
                                            name = {"sameAsShipping"}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                    </Form.Row>

                                    {!values.sameAsShipping && <>
                                    <Form.Row className="mb-3">
                                        <Form.Label column lg={3} className="pl-4">
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
                                        <Form.Label column lg={3} className="pl-4">
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
                                        <Form.Label column lg={3} className="pl-4">
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
                                        <Form.Label column lg={3} className="pl-4">
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
                                        <Form.Label column lg={3} className="pl-4">
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
                                        <Form.Label column lg={3} className="pl-4">
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
                                    </>}
                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={3} className="pl-4">
                                        Place of Supply
                                    </Form.Label>
                                    <Col lg={8} md={8}>
                                        <Form.Control 
                                            type="text" 
                                            value = {values.placeOfSupply} 
                                            name = "placeOfSupply"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            disabled
                                        />
                                    </Col>
                                    </Form.Row>
                                </Card.Text>
                                </Card>
                            </Col>
                            <Col md={7}>
                                <Card className="card-style mb-4 add-sales-invoice">
                                <Card.Text className="card-title pb-2 pl-4">
                                    <FontAwesomeIcon
                                    icon={faListAlt}
                                    className="mr-2 mt-3"
                                    />
                                    Invoice Details
                                </Card.Text>
                                <Card.Text>
                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={2} className="pl-2">
                                        Invoice Type
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control as="select" value = {values.invoiceType} name = {"invoiceType"} onChange={handleChange}>
                                            <option value = {"Regular"}>Regular</option>
                                            <option value = {"Bill Of Supply"}>Bill Of Supply</option>
                                            <option value = {"SEZ Invoice(With IGST)"}>SEZ Invoice(With IGST)</option>
                                            <option value = {"SEZ Invoice(Without IGST)"}>SEZ Invoice(Without IGST)</option>
                                        </Form.Control>
                                    </Col>
                                    </Form.Row>

                                    {errors.invoiceNo && <Form.Row className="mb-3">
                                        <span className = "text-danger pl-2">{errors.invoiceNo}</span>
                                    </Form.Row>}
                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={2} className="pl-2">
                                        Invoice No
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control 
                                            type="text" 
                                            value = {values.invoiceNo}
                                            name = "invoiceNo"
                                            onBlur={(e) => {
                                                let invoices = JSON.parse(sessionStorage.getItem("invoices"));
                                                if(invoices.some(inv => inv.invoiceNo == e.target.value)){
                                                    if(props.location.state.customerValues && (props.location.state.customerValues.invoiceNo == e.target.value))
                                                    {
                                                        setInvoiceNumError(false)
                                                    } else {
                                                        setInvoiceNumError(true)
                                                    }
                                                } else {
                                                    setInvoiceNumError(false)
                                                }
                                            }}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                    <Form.Label column lg={2} className="pl-2">
                                        Date
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control 
                                            type="date" 
                                            value = {values.date}
                                            name = "date"
                                            onChange={handleChange}
                                        />
                                    </Col>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={2} className="pl-2">
                                        Challan No
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control 
                                            type="text" 
                                            value = {values.challanNo}
                                            name = {"challanNo"}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                    <Form.Label column lg={2} className="pl-2">
                                        Challan Date
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control 
                                            type="date" 
                                            value = {values.challanDate}
                                            name = {"challanDate"}
                                            onChange = {handleChange}
                                        />
                                    </Col>
                                    </Form.Row>
                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={2} className="pl-2">
                                        PO No
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control 
                                            type="text" 
                                            value = {values.poNo}
                                            name = {"poNo"}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </Col>

                                    <Form.Label column lg={2} className="pl-2">
                                        PO Date
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control 
                                            type="date" 
                                            value = {values.poDate}
                                            name = {"poDate"}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={2} className="pl-2">
                                        LR No
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control 
                                            type="text" 
                                            value = {values.lrNo}
                                            name = {"lrNo"}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </Col>

                                    <Form.Label column lg={2} className="pl-2">
                                        E-way No
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control 
                                            type="text" 
                                            value = {values.ewayNo}
                                            name = {"ewayNo"}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </Col>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                    <Form.Label
                                        column
                                        lg={2}
                                        className="pl-2"
                                    ></Form.Label>
                                    <Col lg={4} md={4}></Col>

                                    <Form.Label
                                        column
                                        lg={2}
                                        className="pl-2"
                                    ></Form.Label>
                                    <Col lg={4} md={4}>
                                        <Button
                                        name="Add New Transport"
                                        havingIcon={true}
                                        iconType={faPlus}
                                        buttonType="btn btn-primary"
                                        onClick={() => window.history.push("/addtransport")}
                                        />
                                    </Col>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                        <Form.Label column lg={4} className="pl-2">
                                            DISPATCH THROUGH
                                        </Form.Label>
                                        <div className = "dropdown col-lg-8 col-md-8">
                                            <Col lg={8} md={8}>
                                                <Form.Control
                                                    type="text"
                                                    label="Enter transport name"
                                                    value = {transportName}
                                                    onChange={(e) => setTransportName(e.target.value)}
                                                    onFocus = {(e) => setShowtransportDropdown(true)}
                                                    //onBlur = {(e) => setShowtransportDropdown(false)}
                                                />
                                            </Col>
                                            <ul className={`col-lg-8 col-md-8 drop-custom dropdown-menu ${showtransportDropdown && 'd-block'}`}>
                                                {transports.map((trans,index) => (
                                                    <li onClick = {() => {
                                                            setTransportName(trans.transportName);
                                                            setTransport(trans)
                                                            setShowtransportDropdown(false)
                                                        }} 
                                                        key = {index}>
                                                        <span>{trans.transportName}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Form.Row>

                                    <Form.Row className="mb-3">
                                    <Form.Label column lg={2} className="pl-2">
                                        Trans ID
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control
                                        type="text"
                                        label="Transport ID"
                                        value = {transport.transportId}
                                        readOnly
                                        />
                                    </Col>

                                    <Form.Label column lg={2} className="pl-2">
                                        Vehicle No
                                    </Form.Label>
                                    <Col lg={4} md={4}>
                                        <Form.Control 
                                        type="text" 
                                        label="Vehicle No" 
                                        value = {transport.vehicleNo}
                                        />
                                    </Col>
                                    </Form.Row>
                                </Card.Text>
                                </Card>
                            </Col>
                            </Row>
                            <Card className="card-style mb-4 add-sales-invoice mt-2">
                            <Card.Text className="card-title pb-2 pl-2">
                                <FontAwesomeIcon icon={faListAlt} className="mr-2 mt-3" />
                                Product Items
                            </Card.Text>
                            <Card.Text className="ml-2 mr-2">
                                <Form.Row>
                                <Button
                                    name="Add New Product"
                                    havingIcon={true}
                                    iconType={faPlus}
                                    buttonType="btn btn-primary"
                                    onClick={() => setShowProductModal(true)}
                                />
                                &nbsp;&nbsp;
                                <Button
                                    name="Add New Transport / Packaging Charges"
                                    havingIcon={true}
                                    iconType={faPlus}
                                    buttonType="btn btn-primary"
                                    onClick={() => window.history.push("/addtransport")}
                                />
                                <Col
                                    className="d-flex justify-content-end"
                                >
                                    <Button
                                        className = "d-flex justify-content-end"
                                        havingIcon={true}
                                        iconType={faPlus}
                                        buttonType="btn btn-primary"
                                        onClick={() => {
                                            let newProduct = {
                                                productName: "",
                                                product_sacCode: "",
                                                product_qty: "",
                                                product_price: "",
                                                product_discount: "",
                                                product_Igst: "",
                                                product_Cgst: "",
                                                product_Sgst: "",
                                                product_cessPercent: "",
                                                product_cessAmount: ""
                                            };
                                            let tempArray = selectedProducts.slice();
                                            tempArray.push(newProduct);
                                            setSelectedProducts(tempArray);
                                        }}
                                    />
                                </Col>
                                </Form.Row>
                                <br />
                                <Table
                                bordered
                                striped
                                hover
                                responsive
                                className="mb-0"
                                >
                                <colgroup>
                                    <col span = "1" style = {{width: "4%"}}/>
                                    <col span = "1" style = {{width: "13%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "7%"}}/>
                                    <col span = "1" style = {{width: "10%"}}/>
                                    <col span = "1" style = {{width: "5%"}}/>
                                </colgroup>
                                <thead>
                                    <tr>
                                    <th>SR</th>
                                    <th>Product / OTHER CHARGES</th>
                                    <th>HSN / SAC CODE</th>
                                    <th>QTY</th>
                                    <th>PRICE(Rs)</th>
                                    <th>DISC %</th>
                                    <th>CGST %</th>
                                    <th>CGST (RS)</th>
                                    <th>SGST %</th>
                                    <th>SGST (RS)</th>
                                    <th>IGST %</th>
                                    <th>IGST (RS)</th>
                                    <th>CESS</th>
                                    <th>TOTAL</th>
                                    <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProducts.map((product,index) => (
                                       <tr key = {index}>
                                       <td>{index+1}</td>
                                       <td className = "dropdown">
                                           <input
                                               className = "table-input"
                                               autoComplete = "off"
                                               type="text"
                                               placeholder="Enter product name"
                                               value = {product.productName}
                                               name = "product_name"
                                               onChange = {(e) => {
                                                   setProductDetails(index,'productName',e.target.value)
                                                   fetchSearchResult(e.target.value)
                                                   .then(result => setProducts(result))
                                                   .catch(() => setProducts([]))
                                                }}
                                                onBlur = {() => {
                                                    //setShowproductDropdown(index)
                                                    if(products.length < 1) {
                                                        setProductDetails(index,'productName',"");
                                                        alert("Product does not exist");
                                                    }
                                                }}
                                               onClick = {() => setShowproductDropdown(index)}
                                               size={4}
                                           />{" "}
                                           <ul className={`dropdown-menu drop-custom ${(showproductDropdown === index && products.length > 0) && 'd-block'}`}>
                                               {products.map((prod,prodIndex) => (
                                                   <li onClick = {() => {
                                                           setProductName(prod.name);
                                                           //setSelectedProducts(prod)
                                                           setShowproductDropdown("-1")
                                                           let tempArray = selectedProducts.slice();
                                                           let editProduct = tempArray[index];
                                                           editProduct.productName = prod.name
                                                           editProduct.product_price = prod.sellPrice
                                                           editProduct.stock = prod.stock
                                                           editProduct.product_qty = "1"
                                                           editProduct.product_sacCode = prod.hsnCode
                                                           editProduct.product_Igst = values.placeOfSupply != stateOfUser ? prod.IGST : "0"
                                                           editProduct.product_Cgst = values.placeOfSupply == stateOfUser ? prod.CGST : "0"
                                                           editProduct.product_Sgst = values.placeOfSupply == stateOfUser ? prod.SGST : "0"
                                                           editProduct.product_id = prod.id

                                                           setSelectedProducts(tempArray);
                                                       }} 
                                                       key = {prodIndex}>
                                                       <span>{prod.name}</span>
                                                   </li>
                                               ))}
                                           </ul>
                                           {/* <input
                                           type="text"
                                           placeholder="Enter product name"
                                           size={4}
                                           /> */}
                                       </td>
                                       <td>
                                           <input 
                                               className = "table-input"
                                               type="text" 
                                               placeholder="HSN /SAC CODE" 
                                               size={4}
                                               value = {product.product_sacCode}
                                               name = "product_sacCode"
                                               onChange = {(e) => setProductDetails(index,'product_sacCode',e.target.value)}
                                               onBlur = {handleBlur}
                                           />
                                       </td>
                                       <td>
                                           <input 
                                               className = "table-input"
                                               type="text" 
                                               placeholder="QTY" 
                                               size={4}
                                               value = {product.product_qty}
                                               name = "product_qty"
                                               onChange = {(e) => setProductDetails(index,'product_qty',e.target.value)}
                                               onBlur = {handleBlur}
                                           />
                                       </td>
                                       <td>
                                           <input 
                                               className = "table-input"
                                               type="text" 
                                               placeholder="Price" 
                                               size={4}
                                               value = {product.product_price}
                                               name = "product_price"
                                               onChange = {(e) => setProductDetails(index,'product_price',e.target.value)}
                                               onBlur = {handleBlur}
                                           />
                                       </td>
                                       <td>
                                           <input 
                                               className = "table-input"
                                               type="text" 
                                               placeholder="0" 
                                               size={4}
                                               value = {product.product_discount}
                                               name = "product_discount"
                                               onChange = {(e) => setProductDetails(index,'product_discount',e.target.value)}
                                               onBlur = {handleBlur}
                                           />
                                       </td>
                                       <td>
                                           <input
                                           className = "table-input"
                                           type="text"
                                           placeholder="%"
                                           value = {product.product_Cgst}
                                           name = "product_Cgst"
                                           onChange = {(e) => setProductDetails(index,'product_Cgst',e.target.value)}
                                           disabled = {true}
                                           size={4}
                                           />
                                       </td>
                                       <td>
                                           <input
                                           className = "table-input"
                                           type="text"
                                           placeholder="0"
                                           value = {((product.product_Cgst/100)*(product.product_price*product.product_qty)).toFixed(2)}
                                           disabled
                                           size={4}
                                           />
                                       </td>
                                       <td>
                                           <input
                                               className = "table-input"
                                               type="text"
                                               placeholder="%"
                                               value = {product.product_Sgst}
                                               name = "product_Sgst"
                                               onChange = {(e) => setProductDetails(index,'product_Sgst',e.target.value)}
                                               disabled = {true}
                                               size={4}
                                           />
                                       </td>
                                       <td>
                                           <input
                                               className = "table-input"
                                               type="text"
                                               placeholder="0"
                                               value = {((product.product_Sgst/100)*(product.product_price*product.product_qty)).toFixed(2)}
                                               disabled
                                               size={4}
                                           />
                                       </td>
                                       <td>
                                           <input 
                                               className = "table-input"
                                               type="text" 
                                               placeholder="%" 
                                               value = {product.product_Igst}
                                               name = "product_Igst"
                                               onChange = {(e) => setProductDetails(index,'product_Igst',e.target.value)}
                                               disabled = {true}
                                               size={4} 
                                           />
                                       </td>
                                       <td>
                                           <input
                                               className = "table-input"
                                               type="text"
                                               placeholder="0"
                                               value = {((product.product_Igst/100)*(product.product_price*product.product_qty)).toFixed(2)}
                                               disabled
                                               size={4}
                                           />
                                       </td>
                                       <td>
                                           <input 
                                               className = "table-input"
                                               type="text" 
                                               placeholder="%" 
                                               size={4} 
                                               disabled
                                           />
                                       </td>
                                       <td>
                                           <input 
                                               className = "table-input"
                                               type="text" 
                                               placeholder="Total" 
                                               name = {"product_Total"}
                                               onChange = {handleChange}
                                               onFocus = {() => setEditing(true)}
                                               onBlur = {(e) => {
                                                   let total = e.target.value;
                                                   let newPrice = (total/(((product.product_Igst/100) + (product.product_Cgst/100) + (product.product_Sgst/100)) + 1))
                                                   
                                                   let tempArray = selectedProducts.slice();
                                                   let prod = tempArray[index];
                                                   prod.product_price = newPrice;
                                                   setSelectedProducts(tempArray);
                                                   setEditing(false)
                                               }}
                                               value = {editing ? product.product_Total :((product.product_Igst/100)*(product.product_price*product.product_qty)
                                                   + (product.product_Cgst/100)*(product.product_price*product.product_qty)
                                                   + (product.product_Sgst/100)*(product.product_price*product.product_qty)
                                                   +(product.product_price*product.product_qty)).toFixed(2)}   
                                               size={4}  
                                           />
                                       </td>
                                       <td>
                                        <button className = "btn btn-danger" onClick = {() => {
                                            let tempArray = selectedProducts.slice();
                                            tempArray.splice(index,1);
                                            setSelectedProducts(tempArray);
                                        }}/>
                                       </td>
                                       </tr> 
                                    ))}
                                    {/* <tr>
                                    <td colSpan="3">Total Inc Val</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td colSpan="2">0</td>
                                    </tr> */}
                                    <tr className="text-right">
                                    <td colSpan="6"></td>
                                    <td colSpan="7">Total taxable</td>
                                    <td colSpan="2">{(selectedProducts.reduce((a, b) => a + ((b.product_price*b.product_qty) || 0), 0)).toFixed(2)}</td>
                                    </tr>

                                    <tr className="text-right">
                                    <td colSpan="6"></td>
                                    <td colSpan="7">Total tax</td>
                                    <td colSpan="2">{(selectedProducts.reduce((a,b) => a + ((b.product_Igst/100)*(b.product_price*b.product_qty)
                                                + (b.product_Cgst/100)*(b.product_price*b.product_qty)
                                                + (b.product_Sgst/100)*(b.product_price*b.product_qty) || 0), 0)).toFixed(2)}
                                    </td>
                                    </tr>

                                    {/* <tr className="text-right">
                                    <td colSpan="6"></td>
                                    <td colSpan="7">TCS RS %</td>
                                    <td colSpan="2"><input size={2} /></td>
                                    </tr>

                                    <tr className="text-right">
                                    <td colSpan="6"></td>
                                    <td colSpan="7">DISCOUNT RS %</td>
                                    <td colSpan="2"><input size={2} /></td>
                                    </tr> */}
                                    <tr className="text-right">
                                        <td colSpan="6"></td>
                                        <td colSpan="7">
                                            <button 
                                                type= "button" 
                                                className = {`btn ${selectedArithmetic === "plus" ? 'btn-primary' : 'btn-secondary'}`}
                                                onClick = {() => setSelectedArithmetic("plus")}
                                            >
                                                <FontAwesomeIcon icon = {faPlus}/>
                                            </button>
                                            <button 
                                                type= "button" 
                                                className = {`btn ${selectedArithmetic === "minus" ? 'btn-primary' : 'btn-secondary'}`}
                                                onClick = {() => setSelectedArithmetic("minus")}
                                            >
                                                <FontAwesomeIcon icon = {faMinus}/>
                                            </button>
                                        </td>
                                        <td colSpan="2">
                                            <input
                                                className = "table-input"
                                                type="text" 
                                                placeholder="Round Off" 
                                                name = {"roundoff"}
                                                onChange = {handleChange}
                                                onBlur = {handleBlur}
                                                value = {values.roundoff}
                                            />
                                        </td>
                                    </tr>
                                    <tr className="text-right">
                                    <td colSpan="6"></td>
                                    <td colSpan="7">Grand Total</td>
                                    <td colSpan="2">{getTotal(values.roundoff)}
                                    </td>
                                    </tr>

                                </tbody>
                                </Table>
                            </Card.Text>
                            </Card>
                            <Card className="card-style mb-4 add-sales-invoice">
                    <Card.Text className="card-title pb-3 d-flex justify-content-start pt-3 pl-2">
                        {toWords.convert(getTotal(values.roundoff))}
                    </Card.Text>
                    </Card>
                        <Form.Row className="mb-3">
                        <Form.Label column lg={2} className="pl-2">
                            Due Date
                        </Form.Label>
                        <Col lg={4} md={4}>
                            <Form.Control
                            type="date"
                            value = {values.dueDate}
                            name = "dueDate"
                            onChange = {handleChange}
                            />
                        </Col>

                        <Form.Label column lg={2} className="pl-2">
                            Document Note / Remarks Not visible on print
                        </Form.Label>
                        <Col lg={4} md={4}>
                            <Form.Control as="textarea" />
                        </Col>
                        </Form.Row>

                        {/* <Form.Row className="mb-3">
                        <Form.Label column lg={2} className="pl-2">
                            Bank
                        </Form.Label>
                        <Col lg={4} md={4}>
                            <Form.Control
                            as="select"
                            />
                        </Col>
                        </Form.Row> */}

                        <Form.Row className="mb-3">
                        <Form.Label column lg={2} className="pl-2">
                            Payment Type
                        </Form.Label>
                        <Col lg={4} md={4}>
                            <Form.Control
                                as="select"
                                value = {values.paymentType}
                                name = "paymentType"
                                onChange = {handleChange}
                            >
                                <option value = "Cash">Cash</option>
                                <option value = "Credit">Credit</option>
                                <option value = "Cheque">Cheque</option>
                                <option value = "Online">Online</option>
                            </Form.Control>
                        </Col>
                        <Col lg={3} md={3}></Col>
                        <Col lg={3} md={3} className="d-flex">
                            <Button
                            name="Back"
                            havingIcon={true}
                            iconType={faChevronLeft}
                            buttonType="btn btn-outline-dark btn-light"
                            onClick = {() => window.history.back()}
                            />
                            &nbsp;&nbsp;
                            <Button
                            name="Save and print"
                            havingIcon={true}
                            iconType={faSave}
                            buttonType="btn btn-primary"
                            />
                            &nbsp;&nbsp;
                            <Button
                            name="Save"
                            havingIcon={true}
                            iconType={faSave}
                            buttonType="btn btn-primary"
                            onClick = {handleSubmit}
                            />
                        </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={2} className="pl-2">
                            Payment Note
                            </Form.Label>
                            <Col lg={4} md={4}>
                            <Form.Control
                                as="textarea"
                                value = {values.paymentNote}
                                name = "paymentNote"
                                onChange = {handleChange}
                                onBlur = {handleBlur}
                            />
                            </Col>
                            <Col lg={3} md={3}></Col>
                            <Col lg={3} md={3} className="d-flex">
                                {showError.customer && <span className = "text-danger">*Customer Not Selected</span>}&nbsp;&nbsp;
                                {showError.product && <span className = "text-danger">*Product Not Added</span>}
                            </Col>
                            </Form.Row>

                            <Form.Row className="mb-3">
                            <Form.Label column lg={2} className="pl-2">
                            {`Terms & Conditions`}
                            </Form.Label>
                            <Col lg={4} md={4}>
                            <Form.Control
                                as="textarea"
                                value = {values.terms}
                                name = "terms"
                                onChange = {handleChange}
                                onBlur = {handleBlur}
                            />
                            </Col>
                            </Form.Row>
                        </Form>
                    )}
                </Formik>
            </Card.Text>
          </Card>
        </Col>
      </Row>
      {showcustomerModal && <div className="modal login-modal" style = {{display:"flex",justifyContent:"center",alignItems:"center", backgroundColor: "rgba(0,0,0,0.4)"}}>
      <Row>
        <Col md={2} sm={1}></Col>
        <Col style = {{width:"70vw"}}>
          <Card className="card-style mb-4">
            <Card.Text className="card-title pb-2 pl-4">
              <FontAwesomeIcon icon={faEdit} className="mr-2 mt-3" />
              Add Customer / Vendor
            </Card.Text>
            <Card.Text className="ml-2 mr-2" style ={{height: "70vh",overflowY: "scroll",overflowX:"hidden"}}>
              <Formik
                initialValues = 
                {{
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
                onSubmit={(values,{ setSubmitting, resetForm }) => {
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
                    SetCustomers(data).then(res => {
                        setSubmitting(false);
                        setShowCustomerModal(false);
                    }).catch((error) => {
                        console.log("create customer failed")
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
                    <Form>
                        {errors.customerName && <Form.Row>
                            <Form.Label column lg={3} className="pl-4"/>
                            <Col lg={6} md={6}>
                                <div className="form-message text-danger">{errors.customerName}</div> 
                            </Col>
                        </Form.Row>}
                        <Form.Row className="mb-3">
                            <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4"></Form.Label>
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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

                        <Form.Row className="mb-3">
                        <Form.Label column lg={3} className="pl-4">
                            GSTIN
                        </Form.Label>
                        <Col lg={6} md={6}>
                            <Form.Control type="text" placeholder="Enter GSTIN" 
                            value = {values.gstin}
                            name = {"gstin"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            />
                        </Col>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4 font-weight-bold">
                            Additonal Shipping Address
                        </Form.Label>
                        </Form.Row>

                        <Form.Row className="mb-3">
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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
                        <Form.Label column lg={3} className="pl-4">
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

                        <Card className="card-style mb-4 ml-2 mr-2">
                        <Card.Text className="card-title pb-3 pt-3">
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
                                    name="Close"
                                    havingIcon={true}
                                    iconType={faChevronLeft}
                                    buttonType="btn btn-outline-dark btn-light"
                                    onClick = {() => setShowCustomerModal(false)}
                                />
                            </Col>
                            </Row>
                        </Card.Text>
                        </Card>
                    </Form>
                )}
              </Formik>
            </Card.Text>
          </Card>
        </Col>
        <Col md={2} sm={1}></Col>
      </Row>
        </div>}
    {showProductModal && <div className="modal login-modal" style = {{display:"flex",justifyContent:"center",alignItems:"center", backgroundColor: "rgba(0,0,0,0.4)"}}>
    <Row>
        <Col md={2} sm={1}></Col>
        <Col style = {{width:"70vw"}}>
          <Card className="card-style mb-4">
            <Card.Text className="card-title pb-2 pl-4">
              <FontAwesomeIcon icon={faEdit} className="mr-2 mt-3" />
              Add Product
            </Card.Text>
            <Card.Text className="ml-2 mr-2" style ={{height: "70vh",overflowY: "scroll",overflowX:"hidden"}}>
                <Formik
                    initialValues = {{
                        name: "",
                        note: "",
                        hsnCode: "",
                        unit: "",
                        stock: "",
                        product: "",
                        isItc: false,
                        CGST: "",
                        SGST: "",
                        IGST: "",
                        CESS: "",
                        sellPrice: "0",
                        sellPriceWithTax: "",
                        purchasePrice: "0",
                        purchasePriceWithTax: "",
                        isServiceItem: false,
                        isProductEnable: false
                    }}
                    validationSchema={productScheuma}
                    onSubmit={async (values,{ setSubmitting, resetForm }) => {
                        setSubmitting(true);
                        let data = {
                            name: values.name,
                            note: values.note,
                            hsnCode: values.hsnCode,
                            unit: values.unit,
                            stock: values.stock,
                            product: values.product,
                            isItc: values.isItc,
                            CGST: values.CGST,
                            SGST: values.SGST,
                            IGST: values.IGST,
                            CESS: values.CESS,
                            sellPrice: values.sellPrice,
                            sellPriceWithTax: values.sellPriceWithTax,
                            purchasePrice: values.purchasePrice,
                            purchasePriceWithTax: values.purchasePriceWithTax,
                            isServiceItem: values.isServiceItem,
                            isProductEnable: values.isProductEnable,
                            status: "Active"
                        }

                        SetProduct(data).then(res => {
                            setSubmitting(false);
                            setShowProductModal(false)
                        }).catch((error) => {
                            console.log("create transport failed")
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
                        setFieldValue,
                        isSubmitting,
                    }) => (
                        <ProductComponent
                            handleBlur = {handleBlur}
                            handleChange = {handleChange}
                            handleSubmit = {handleSubmit}
                            setFieldValue = {setFieldValue}
                            values = {values}
                            errors = {errors}
                            touched = {touched}
                        />
                    )}
                </Formik>
            </Card.Text>
          </Card>
        </Col>
        <Col md={2} sm={1}></Col>
      </Row>
    </div>}
    </div>
  );
}

export default AddSalesInvoice;
