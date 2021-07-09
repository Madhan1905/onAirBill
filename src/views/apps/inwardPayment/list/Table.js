// ** React Imports
import React, { Fragment, useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Table, Form } from 'react-bootstrap';

// ** Invoice List Sidebar
import Sidebar from './Sidebar'

// ** Columns
//import { columns } from './columns'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import { Card, CardHeader, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Edit, Printer, Share2 } from 'react-feather'

//firebase methods
import { DeletePayment, fetchPayment } from '../../../../Services/FirebaseSerice';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'



// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, searchTerm }) => {
  return (
    <div className='invoice-list-table-header w-100 mr-1 ml-50 mt-2 mb-75'>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
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
          xl='6'
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

const InwardPayment = () => {

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
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState([]);
  const [newStack, setNewStack] = useState(0)
  const [editItem, setEditItem] = useState({});

  const [receiptDetails, setReceiptDetails] = useState([]);
  const [filteredReceiptDetails, setFilteredReceiptDetails] = useState([]);

  useEffect(() => {
    if (!loading) {
      fetchPayment("InwardPayment").then(response => {
        setReceiptDetails(response)
        setFilteredReceiptDetails(response)
      })
        .catch(() => setReceiptDetails([]))
    }
  }, [loading])

  const selectIndex = (index, value) => {
    let tempArray = receiptDetails.slice();
    tempArray[index]['selected'] = value;
    setReceiptDetails(tempArray);
  }

  const selectAll = (value) => {
    let tempArray = receiptDetails.slice();
    tempArray.map(staff => {
      staff.selected = value
    })
    setReceiptDetails(tempArray);
  }

  const deleteSelected = () => {
    setLoading(true);
    let selectedArray = receiptDetails.filter(staff => staff.selected === true)
    DeletePayment(selectedArray, "InwardPayment")
      .then(() => {
        setLoading(false);
        console.log("delete successfull");
      })
      .catch(error => console.log("Delete failed", error))
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

  // ** Table data to render
  const dataToRender = () => {

    if (filteredProducts.length > 0) {
      return filteredProducts
    } else if (filteredProducts.length === 0) {
      return []
    } else {
      return filteredProducts.slice(0, rowsPerPage)
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="">
          <CardTitle tag='h4'>Payment Receipt List</CardTitle>
        </CardHeader>
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
                <th ><input type="checkbox" onChange={(e) => selectAll(e.target.checked)} /></th>
                <th className="green-text">RECEIPT NO</th>
                <th className="green-text">COMPANY NAME</th>
                <th className="green-text">PAYMENT DATE</th>
                <th className="green-text">PAYMENT TYPE</th>
                <th>PAYMENT NOTE</th>
                <th className="green-text">AMOUNT</th>
                <th>EDIT</th>
                <th>PRINT</th>
              </tr>
            </thead>
            <tbody>
              {receiptDetails.length > 0 ? (
                receiptDetails.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center align-middle">
                        <Form.Check
                          type="checkbox"
                          className="m-0"
                          onChange={() => selectIndex(index, !item.selected)}
                          checked={item.selected}
                        />
                      </td>
                      <td className="text-center align-middle">{item.receiptNum}</td>
                      <td className="text-center align-middle">{item.customer.customerName}</td>
                      <td className="text-center align-middle">{item.paymentDate}</td>
                      <td className="text-center align-middle">{item.paymentType}</td>
                      <td className="text-center align-middle">{item.paymentNote}</td>
                      <td className="text-center align-middle">{item.amount}</td>
                      <td className="text-center align-middle"><Button.Ripple
                        color="primary"
                        outline
                        size="sm"
                        name="Edit"
                        havingIcon={true}
                        buttonType="btn btn-outline-dark btn-light"
                        onClick={() =>
                          toggleSidebar(item)
                        }
                      >
                        <Edit size={14} />
                        Edit</Button.Ripple>
                      </td>
                      <td className="text-center align-middle">
                        <div className="mb-1 print-button-alignment">
                          <Button.Ripple
                            color="primary"
                            outline
                            size="sm"
                            name="Print"
                            havingIcon={true}
                            buttonType="btn btn-outline-dark btn-light"
                          >
                            <Printer size={14} />
                            Print</Button.Ripple>
                        </div>
                        <Button.Ripple
                          color="primary"
                          outline
                          size="sm"
                          name="Share"
                          havingIcon={true}
                          buttonType="btn btn-outline-dark btn-light"
                        >
                          <Share2 size={14} />
                          <span>Share</span></Button.Ripple>

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

export default InwardPayment;
