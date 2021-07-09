// ** React Imports
import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Form } from 'react-bootstrap';

// ** Invoice List Sidebar
import Sidebar from './Sidebar'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { Card, CardHeader, CardText, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Edit,Printer } from 'react-feather'
import { Formik } from 'formik';

//firebase methods
import { fetchCustomers, fetchProducts, fetchPurchaseInvoice,DeletePurchaseInvoice }  from '../../../../Services/FirebaseSerice';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, searchTerm ,invoiceDetails }) => {
  const history = useHistory()
  return (
    <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
      <Row>
        <Col xl='5' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <Label for='rows-per-page'>Show</Label>
            <CustomInput
              className='form-control mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{
                width: '5rem',
                padding: '0 0.8rem',
                backgroundPosition: 'calc(100% - 3px) 11px, calc(100% - 20px) 13px, 100% 0'
              }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </CustomInput>
            <Label for='rows-per-page'>Entries</Label>
          </div>
        </Col>
        <Col
          xl='7'
          className='d-flex align-items-sm-center justify-content-lg-end justify-content-start flex-lg-nowrap flex-wrap flex-sm-row flex-column pr-lg-1 p-0 mt-lg-0 mt-1'
        >

          <Button.Ripple color='primary' onClick={() => history.push({
                  pathname: '/addpurchaseinvoice',
                  state: { invoiceCount: invoiceDetails.length }
                })}>
            Add New
          </Button.Ripple>
        </Col>
      </Row>
    </div>
  )
}

const SalesInvoice= () => {

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState({ value: '', label: 'Select Role' })
  const [currentPlan, setCurrentPlan] = useState({ value: '', label: 'Select Plan' })
  const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Select Status', number: 0 })
  const history = useHistory()
  const [products, setProducts] = useState([]);
  const [nameQuery, setNameQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [customerDetails,setCustomerDetails] = useState([]);
  const [filteredCustomers,setFilteredCustomers] = useState([]);
  const [invoiceDetails,setInvoiceDetails] = useState([]);
  const [showSearch,setShowSearch] = useState(false);
  const [printEnable,setPrintEnable] = useState(false); 
  const [printInvoice,setPrintInvoice]= useState(null);
  const [filteredInvoice,setFilteredInvoice] = useState([]);
  

  useEffect(() => {
    if(!loading) {
      fetchPurchaseInvoice().then(response => {
        setInvoiceDetails(response)
        setFilteredInvoice(response)
        sessionStorage.setItem("invoices",JSON.stringify(response))
      })
      .catch(() => setInvoiceDetails([]))
    }
  },[loading])

  useEffect(() => {
    fetchProducts().then(response => setProducts(response))
        .catch(() => setProducts([]))
  },[])

  useEffect(() => {
    fetchCustomers().then(response => setCustomerDetails(response.filter(customer => customer.companyType === "Customer")))
    .catch(() => setCustomerDetails([]))
  },[])

  const filterCustomers = (values) => {
    let tempArray = invoiceDetails.slice();
    if(values.companyQuery !== ""){
      tempArray = tempArray.filter(customer => customer.customer.customerName === values.companyQuery)
    }
    if(values.productQuery !== ""){
      tempArray = tempArray.filter(customer => customer.productName === values.productQuery)
    }
    if(values.startDateQuery !== ""){
      tempArray = tempArray.filter(customer => customer.date === values.startDateQuery)
    }
    if(values.endDateQuery !== ""){
      tempArray = tempArray.filter(customer => customer.dueDate === values.endDateQuery)
    }
    if(values.invoiceQuery !== ""){
      tempArray = tempArray.filter(customer => customer.invoiceNo == values.invoiceQuery)
    }
    if(values.totalQuery !== ""){
      tempArray = tempArray.filter(customer => customer.total == values.totalQuery)
    }
    if(values.typeQuery !== ""){
      tempArray = tempArray.filter(customer => customer.paymentType === values.typeQuery)
    }
    if(values.poNumQuery !== ""){
      tempArray = tempArray.filter(customer => customer.poNo === values.poNumQuery)
    }
    if(values.poDateQuery !== ""){
      tempArray = tempArray.filter(customer => customer.poDate === values.poDateQuery)
    }
    if(values.lrNumQuery !== ""){
      tempArray = tempArray.filter(customer => customer.lrNo === values.lrNumQuery)
    }

    setFilteredInvoice(tempArray);
  }

  const selectIndex = (index,value) => {
    let tempArray = invoiceDetails.slice();
    tempArray[index]['selected'] = value;
    setInvoiceDetails(tempArray);
  }

  const selectAll = (value) => {
      let tempArray = invoiceDetails.slice();
      tempArray.map(staff => {
          staff.selected = value
      })
      setInvoiceDetails(tempArray);
  }

  const deleteSelected = () => {
    if(window.confirm("Are you sure you want to delete?")){
      setLoading(true);
      let selectedArray = invoiceDetails.filter(staff => staff.selected === true)
      DeletePurchaseInvoice(selectedArray)
      .then(() => {
        setLoading(false);
        console.log("delete successfull");
      })
      .catch(error => console.log("Delete failed",error))
    }
  }

  const getDateString = (date) => {
    var date = new Date(date);
    return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
  }

  // ** Function to toggle sidebar
  const toggleSidebar = (item) => {
    setEditItem(item);
    setSidebarOpen(!sidebarOpen);
  }


  // ** Function in get data on page change
  const handlePagination = page => {
    dispatch(
      getData({
        page: page.selected + 1,
        perPage: rowsPerPage,
        role: currentRole.value,
        currentPlan: currentPlan.value,
        status: currentStatus.value,
        q: searchTerm
      })
    )
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getData({
        page: currentPage,
        perPage: value,
        role: currentRole.value,
        currentPlan: currentPlan.value,
        status: currentStatus.value,
        q: searchTerm
      })
    )
    setRowsPerPage(value)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(products.length / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pr-1'}
      />
    )
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="">
          <CardTitle tag='h4'>Purchase Invoice Bill</CardTitle>
  <Button.Ripple color="primary" size="sm" onClick = {() => setShowSearch(!showSearch)}>{showSearch ? '-' : '+'}</Button.Ripple>
        </CardHeader>
        <CardText>
        {showSearch && <CardText className="ml-3 mr-3">
          <Formik
              initialValues = {{
                  companyQuery: "",
                  productQuery: "",
                  startDateQuery: "",
                  endDateQuery: "",
                  invoiceQuery: "",
                  totalQuery: "",
                  typeQuery: "",
                  poNumQuery: "",
                  poDateQuery: "",
                  lrNumQuery: ""
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
                          <Form.Label>Search By Company :</Form.Label>
                          <Form.Control
                              as="select"
                              value = {values.companyQuery}
                              name = "companyQuery"
                              onChange = {handleChange}
                          >
                            <option value = "">Select By Company</option>
                            {customerDetails.map((customer,index) => (
                              <option key = {index}>{customer.customerName}</option>
                            ))}
                          </Form.Control>
                      </Form.Group>
                  </Col>
                  {/* <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Search By Product :</Form.Label>
                          <Form.Control
                              as="select"
                              value = {values.productQuery}
                              name = "productQuery"
                              onChange = {handleChange}
                          >
                            <option value = "">Select By Product</option>
                            {products.map((customer,index) => (
                              <option key = {index}>{customer.name}</option>
                            ))}
                          </Form.Control>
                      </Form.Group>
                  </Col> */}
                  <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Search By StartDate :</Form.Label>
                          <Form.Control 
                              type="date" 
                              value = {values.startDateQuery}
                              name = "startDateQuery"
                              onChange = {handleChange}
                          />
                      </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Search By EndDate :</Form.Label>
                          <Form.Control 
                              type="date" 
                              value = {values.endDateQuery}
                              name = "startDateQuery"
                              onChange = {handleChange}
                          />
                      </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Get By Invoice No :</Form.Label>
                          <Form.Control 
                              type="text" 
                              value = {values.invoiceQuery}
                              name = "invoiceQuery"
                              onChange = {handleChange}
                          />
                      </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Search By Total :</Form.Label>
                          <Form.Control 
                              type="text" 
                              value = {values.totalQuery}
                              name = "totalQuery"
                              onChange = {handleChange}
                          />
                      </Form.Group>
                  </Col>
                  {/* <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Search By Type :</Form.Label>
                          <Form.Control 
                              as="select" 
                              value = {values.typeQuery}
                              name = "typeQuery"
                              onChange = {handleChange}
                          >
                              <option value = "">Select By Type</option>
                              <option value = "Cash">Cash</option>
                              <option value = "Credit">Credit</option>
                              <option value = "Cheque">Cheque</option>
                              <option value = "Online">Online</option>
                          </Form.Control>
                      </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Search By P.O No :</Form.Label>
                          <Form.Control 
                              as="text" 
                              value = {values.poNumQuery}
                              name = "poNumQuery"
                              onChange = {handleChange}
                          />
                      </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Search By P.O Date :</Form.Label>
                          <Form.Control 
                              as="text" 
                              value = {values.poDateQuery}
                              name = "poDateQuery"
                              onChange = {handleChange}
                          />
                      </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3} >
                      <Form.Group controlId="stocksMin">
                          <Form.Label>Search By L.R No :</Form.Label>
                          <Form.Control 
                              as="text" 
                              value = {values.lrNumQuery}
                              name = "lrNumQuery"
                              onChange = {handleChange}
                          />
                      </Form.Group>
                  </Col> */}

                  <Col xs={12} sm={6} md={4} className="d-flex mb-3 justify-content-xs-center justify-content-sm-center justify-content-md-end mt-2">
                      <Button.Ripple
                          name="Search"
                          color="primary"
                          onClick = {() => filterCustomers(values)}
                      >Search</Button.Ripple>
                      &nbsp;&nbsp;
                      <Button.Ripple
                          name="Show All Data"
                          color="primary"
                          onClick = {() => setFilteredInvoice(invoiceDetails)}
                      >Show All Data</Button.Ripple>
                  </Col>
              </Row>
          </Form>)}
          </Formik>
      </CardText>}
      
        </CardText>
        </Card>

        <Card className="mb-4">
        <CardHeader className="card-title pb-2">
          Invoice Summary
        </CardHeader>
        <CardBody className="pb-4">
          <Row>
            <Col className="col-style d-flex justify-content-center">Total Transactions</Col>
            {/* <Col className="col-style">Total CGST</Col>
            <Col className="col-style">Total SGST</Col>
            <Col className="col-style">Total IGST</Col> */}
            <Col className="col-style d-flex justify-content-center">Total Taxable</Col>
            <Col className="col-style d-flex justify-content-center">Total Value</Col>
          </Row>
          <Row>
            <Col className="col-style d-flex justify-content-center">{invoiceDetails.length}</Col>
            {/* <Col className="col-style">Rs.48.00</Col>
            <Col className="col-style">Rs.48.00</Col>
            <Col className="col-style">Rs.0.00</Col> */}
            <Col className="col-style d-flex justify-content-center">
              {`Rs.${invoiceDetails.reduce((a, b) => a + (b.total || 0), 0).toFixed(2)}`}
            </Col>
            <Col className="col-style d-flex justify-content-center">
              {`Rs.${invoiceDetails.reduce((a, b) => a + ((b.total+b.tax) || 0), 0).toFixed(2)}`}
            </Col>
          </Row>
        </CardBody>
      </Card>


      <Card>
        <CardHeader>

          <CustomHeader
            toggleSidebar={toggleSidebar}
            handlePerPage={handlePerPage}
            rowsPerPage={rowsPerPage}
            searchTerm={searchTerm}
            invoiceDetails={invoiceDetails}
          />
        </CardHeader>
        <CardBody>
          <Table hover responsive className="mb-0">
          <thead>
              <tr>
                <th ><input type="checkbox" onChange = {(e) => selectAll(e.target.checked)}/></th>
                <th className="green-text">INVOICE NO</th>
                <th className="green-text">COMPANY NAME</th>
                <th className="green-text">DATE</th>
                <th className="green-text">TOTAL</th>
                <th>REMAINING AMOUNT</th>
                <th className="green-text">PAYMENT TYPE</th>
                <th>EDIT</th>
                {/* <th>PRINT OPTION</th> */}
                <th>PRINT</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoice.length > 0 ? (
                filteredInvoice.map((item,index) => {
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
                      <td>{item.invoiceNo}</td>
                      <td>{item.customer.customerName}</td>
                      <td>{getDateString(item.date)}</td>
                      <td>{item.total + item.tax}</td>
                      <td>{item.remaining}</td>
                      <td className="button-font"><Button.Ripple
                        color="primary"
                        outline
                        size="sm"
                        buttonType="btn btn-success"
                      >{item.paymentType}</Button.Ripple></td>
                      <td><Button.Ripple
                        name="Edit"
                        color="primary"
                        outline
                        size="sm"
                        onClick = {() => {history.push({
                          pathname: '/addpurchaseinvoice',
                              state: { customerValues: {...item,docId: item.id} }
                      })}}
                      >
                        <Edit size={14} />
                        Edit</Button.Ripple></td>
                      {/* <td>
                        <Row>
                        <Col><Form.Check type="checkbox" className="m-0" label="Original" /></Col>
                        <Col><Form.Check type="checkbox" className="m-0" label="Transport" /></Col>
                        </Row>
                        <Row>
                        <Col><Form.Check type="checkbox" className="m-0" label="Office" /></Col>
                        <Col><Form.Check type="checkbox" className="m-0" label="Duplicate" /></Col>
                        </Row>
                        </td> */}
                        
                      <td>
                          <Button.Ripple
                          name="Print"
                          color="primary"
                          outline
                          size="sm"
                          onClick = {() => {
                            setPrintInvoice(item)
                            setPrintEnable(true)
                          }}
                        >
                          <Printer size={14} />
                          Print</Button.Ripple>
                      </td>
                    </tr>
                  );
                })
              ) : (
                  <tr>
                    <td colSpan="10"><div className="d-flex justify-content-center">No results</div></td>
                  </tr>
                )}
            </tbody>
          </Table>

          <CustomPagination />
        </CardBody>
        <Row>
          <Col className="ml-1 mb-3">
            <Button.Ripple color='danger' onClick={() => { deleteSelected() }}>
              Delete
          </Button.Ripple>
          </Col>
        </Row>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} item={editItem} />
    </Fragment>
  )
}

export default SalesInvoice
