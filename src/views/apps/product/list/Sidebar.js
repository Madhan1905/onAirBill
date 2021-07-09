// ** React Import
import { useState } from 'react'
import { useHistory } from 'react-router-dom';

// ** Custom Components
import Sidebar from '@components/sidebar'

// ** Utils
import { isObjEmpty } from '@utils'

// ** Third Party Components
import classnames from 'classnames'
import { useForm } from 'react-hook-form'
import { Button, FormGroup, Label, FormText, Form, Input } from 'reactstrap'

// ** Store & Actions
import { useDispatch } from 'react-redux'

import * as Yup from "yup";
import { Formik } from 'formik';
import { SetProduct,UpdateProduct } from '../../../../Services/FirebaseSerice';
import ProductComponent from '../../../../UserComponents/ProductComponent';

const SidebarNewProuct = (props) => {

  const { open, toggleSidebar } = props;
  console.log('props==========>',props)
  // ** States
  const [role, setRole] = useState('subscriber')
  const [plan, setPlan] = useState('basic')

  // ** Store Vars
  const dispatch = useDispatch()

  // ** To get history
  const history = useHistory();


  const validationScheuma = Yup.object().shape({
    name: Yup.string()
        .max(200, "Must be shorter than 200")
        .required("Must Enter Product Name"),
});

  return (
    <Sidebar
      size='lg'
      open={open}
      title='Add Product'
      headerClassName='mb-1'
      contentClassName='pt-0'
      toggleSidebar={toggleSidebar}
    >
      
      <Formik
                    initialValues = {props.item && props.item.id ? props.item :{
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
                            toggleSidebar = {toggleSidebar}
                        />
                    )}
                </Formik>
    </Sidebar>
  )
}

export default SidebarNewProuct;
