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

  // ** Vars
  const { register, errors, handleSubmit } = useForm()

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
      {/* <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <Label for='full-name'>
            Full Name <span className='text-danger'>*</span>
          </Label>
          <Input
            name='full-name'
            id='full-name'
            placeholder='John Doe'
            innerRef={register({ required: true })}
            className={classnames({ 'is-invalid': errors['full-name'] })}
          />
        </FormGroup>
        <FormGroup>
          <Label for='username'>
            Username <span className='text-danger'>*</span>
          </Label>
          <Input
            name='username'
            id='username'
            placeholder='johnDoe99'
            innerRef={register({ required: true })}
            className={classnames({ 'is-invalid': errors['username'] })}
          />
        </FormGroup>
        <FormGroup>
          <Label for='email'>
            Email <span className='text-danger'>*</span>
          </Label>
          <Input
            type='email'
            name='email'
            id='email'
            placeholder='john.doe@example.com'
            innerRef={register({ required: true })}
            className={classnames({ 'is-invalid': errors['email'] })}
          />
          <FormText color='muted'>You can use letters, numbers & periods</FormText>
        </FormGroup>
        <FormGroup>
          <Label for='company'>
            Company <span className='text-danger'>*</span>
          </Label>
          <Input
            name='company'
            id='company'
            placeholder='Company Pvt Ltd'
            innerRef={register({ required: true })}
            className={classnames({ 'is-invalid': errors['company'] })}
          />
        </FormGroup>
        <FormGroup>
          <Label for='country'>
            Country <span className='text-danger'>*</span>
          </Label>
          <Input
            name='country'
            id='country'
            placeholder='Australia'
            innerRef={register({ required: true })}
            className={classnames({ 'is-invalid': errors['country'] })}
          />
        </FormGroup>
        <FormGroup>
          <Label for='contact'>
            Contact <span className='text-danger'>*</span>
          </Label>
          <Input
            name='contact'
            id='contact'
            placeholder='(397) 294-5153'
            innerRef={register({ required: true })}
            className={classnames({ 'is-invalid': errors['contact'] })}
          />
        </FormGroup>
        <FormGroup>
          <Label for='user-role'>User Role</Label>
          <Input type='select' id='user-role' name='user-role' value={role} onChange={e => setRole(e.target.value)}>
            <option value='subscriber'>Subscriber</option>
            <option value='editor'>Editor</option>
            <option value='maintainer'>Maintainer</option>
            <option value='author'>Author</option>
            <option value='admin'>Admin</option>
          </Input>
        </FormGroup>
        <FormGroup className='mb-2' value={plan} onChange={e => setPlan(e.target.value)}>
          <Label for='select-plan'>Select Plan</Label>
          <Input type='select' id='select-plan' name='select-plan'>
            <option value='basic'>Basic</option>
            <option value='enterprise'>Enterprise</option>
            <option value='company'>Company</option>
            <option value='team'>Team</option>
          </Input>
        </FormGroup>
        <Button type='submit' className='mr-1' color='primary'>
          Submit
        </Button>
        <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form> */}
      <Formik
                    initialValues = {props.location && props.location.state ? props.location.state.customerValues :{
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
                                props.history.push('/apps/product/list')
                            }).catch((error) => {
                                console.log("create transport failed")
                                console.log(error);
                            })
                        } else {
                            UpdateProduct(data,props.location.state.customerValues.docId).then(res => {
                                setSubmitting(false);
                                props.history.push('/apps/product/list')
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
                            toggleSidebar={toggleSidebar}
                        />
                    )}
                </Formik>
    </Sidebar>
  )
}

export default SidebarNewProuct;
