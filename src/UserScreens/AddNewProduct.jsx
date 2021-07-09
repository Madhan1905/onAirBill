import React from 'react';
import { Card, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import * as Yup from "yup";
import { Formik } from 'formik';
import { SetProduct,UpdateProduct } from '../Services/FirebaseSerice';
import ProductComponent from '../UserComponents/ProductComponent';

const AddNewProduct = (props) => {

    const validationScheuma = Yup.object().shape({
        name: Yup.string()
            .max(200, "Must be shorter than 200")
            .required("Must Enter Product Name"),
    });

  return (
    <div className="screen-stocks">
      <Row>
        <Col md={2} sm={1}></Col>
        <Col md={8}>
          <Card className="card-style mb-4">
            <Card.Text className="card-title pb-2 pl-4">
              <FontAwesomeIcon icon={faEdit} className="mr-2 mt-3" />
              Add Product
            </Card.Text>
            <Card.Text className="ml-2 mr-2">
                <Formik
                    initialValues = {props.location.state ? props.location.state.customerValues :{
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
                    validationSchema={validationScheuma}
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

                        if(!props.location.state){
                            SetProduct(data).then(res => {
                                setSubmitting(false);
                                props.history.push('/products')
                            }).catch((error) => {
                                console.log("create transport failed")
                                console.log(error);
                            })
                        } else {
                            UpdateProduct(data,props.location.state.customerValues.docId).then(res => {
                                setSubmitting(false);
                                props.history.push('/products')
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
    </div>
  );
}

export default AddNewProduct;
