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
import { Edit } from 'react-feather'
import { Formik } from 'formik';

//firebase methods
import { deleteCustomers, fetchCustomers }  from '../../../../Services/FirebaseSerice';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'



// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, searchTerm  }) => {
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

          <Button.Ripple color='primary' onClick={() => toggleSidebar()}>
            Add New
          </Button.Ripple>
        </Col>
      </Row>
    </div>
  )
}

const Customers= () => {

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
          <CardTitle tag='h4'>Customer / Vendor</CardTitle>
        </CardHeader>
        <CardText className="ml-3 mr-3">
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
                            <Col xs={12} sm={6} md={2} >
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
                                    onClick = {() => setFilteredCustomers(customerDetails)}
                                >Show All Data</Button.Ripple>
                            </Col>
                        </Row>
                    </Form>)}
                    </Formik>
                </CardText>
      </Card>

      <Card>
        <CardHeader>

          <CustomHeader
            toggleSidebar={toggleSidebar}
            handlePerPage={handlePerPage}
            rowsPerPage={rowsPerPage}
            searchTerm={searchTerm}
          />
        </CardHeader>
        <CardBody>
          <Table hover responsive className="mb-0">
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
                                            <td><Button.Ripple
                                            color="primary"
                                            size="sm"
                                            outline
                                                name="Edit"
                                                buttonType="btn btn-outline-dark btn-light"
                                                onClick = {() => toggleSidebar(item)
                                                }
                                            >Edit</Button.Ripple></td>

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

export default Customers;
