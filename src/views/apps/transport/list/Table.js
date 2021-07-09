// ** React Imports
import React, { Fragment, useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Table, Form } from 'react-bootstrap';

// ** Invoice List Sidebar
import Sidebar from './Sidebar'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import ReactPaginate from 'react-paginate'
import { Card, CardHeader, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { Edit } from 'react-feather'

//firebase methods
import { deleteTransports, fetchTransports }  from '../../../../Services/FirebaseSerice';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'



// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, searchTerm, filterContents  }) => {
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
          <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
            <Label className='mb-0' for='search-invoice'>
              Search By Transport Name or Transport Id:
            </Label>
            <Input
              id='search-Transport'
              className='ml-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => filterContents(e.target.value)}
            />
          </div>

          <Button.Ripple color='primary' onClick={() => toggleSidebar()}>
            Add New
          </Button.Ripple>
        </Col>
      </Row>
    </div>
  )
}

const Transport = () => {

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

  const [transports,setTransports] = useState([]);
  const [filteredTransports,setFilteredTransports] = useState([]);

  useEffect(() => {
    if(!loading){
      fetchTransports()
      .then(response => {
        setTransports(response)
        setFilteredTransports(response)
      })
      .catch(() => setTransports([]))
    }
  },[loading])

  const filterContents = (val) => {
    setSearchTerm(val)
    let tempArray = transports.slice();
    if(val !== ""){
        tempArray = tempArray.filter(element => element.transportName.toLowerCase().includes(val.toLowerCase()) || element.transportId.toLowerCase().includes(val.toLowerCase()) && element)
    }
    setFilteredTransports(tempArray);
  }

  const selectIndex = (index,value) => {
    let tempArray = transports.slice();
    tempArray[index]['selected'] = value;
    setTransports(tempArray);
  }

  const selectAll = (value) => {
      let tempArray = transports.slice();
      tempArray.map(staff => {
          staff.selected = value
      })
      setTransports(tempArray);
  }

  const deleteSelected = () => {
    if(window.confirm("Are you sure you want to delete?")){
      setLoading(true);
      let selectedArray = transports.filter(staff => staff.selected === true)
      deleteTransports(selectedArray)
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
          <CardTitle tag='h4'>Transport</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>

          <CustomHeader
            toggleSidebar={toggleSidebar}
            handlePerPage={handlePerPage}
            rowsPerPage={rowsPerPage}
            searchTerm={searchTerm}
            filterContents={filterContents}
          />
        </CardHeader>
        <CardBody>
          <Table hover responsive className="mb-0">
            <thead>
            <tr>
                <th><input type="checkbox" onChange = {(e) => selectAll(e.target.checked)}/></th>
                <th className="green-text">Transport Name</th>
                <th className="green-text">Transport ID</th>
                <th className="green-text">Vehicle No</th>
                <th>EDIT</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransports.length > 0 ? (
                filteredTransports.map((item,index) => {
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
                      <td>{item.transportName}</td>
                      <td>{item.transportId}</td>
                      <td>{item.vehicleNo}</td>
                      <td><Button.Ripple
                        name="Edit"
                        color="primary"
                          outline
                          size="sm"
                          onClick={() =>
                            toggleSidebar(item)
                          }
                      >
                        <Edit size={14} />
                        Edit</Button.Ripple></td>
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

export default Transport;
