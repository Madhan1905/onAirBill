// ** React Imports
import { Fragment, useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';

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
import {Table, Form} from 'react-bootstrap';
import { Card, CardHeader, CardTitle, CardBody, Input, Row, Col, Label, CustomInput, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem  } from 'reactstrap'
import { MoreVertical, FileText, Trash2, Archive } from 'react-feather'

//firebase methods
import { fetchProducts, MultipleStockUpdate } from '../../../../Services/FirebaseSerice';

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'



// ** Table Header
const CustomHeader = ({ toggleSidebar, handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
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
          <div className='d-flex align-items-center mb-sm-0 mb-1 mr-1'>
            <Label className='mb-0' for='search-invoice'>
              Search Products:
            </Label>
            <Input
              id='search-invoice'
              className='ml-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
            />
          </div>
          <Button.Ripple color='primary' onClick={toggleSidebar}>
            Add New Product
          </Button.Ripple>
        </Col>
      </Row>
    </div>
  )
}

const UsersList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.users)

  // ** States
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState({ value: '', label: 'Select Role' })
  const [currentPlan, setCurrentPlan] = useState({ value: '', label: 'Select Plan' })
  const [currentStatus, setCurrentStatus] = useState({ value: '', label: 'Select Status', number: 0 })
  const history = useHistory()
  const [products,setProducts] = useState([]);
  const [nameQuery,setNameQuery] = useState("");
  const [filteredProducts,setFilteredProducts] = useState([]);
  const [loading,setLoading] = useState(false);
  const [updatedProduct,setUpdatedProduct] = useState([]);
  const [newStack, setNewStack] = useState(0)


    useEffect(() => {
    if(!loading) {
      fetchProducts()
      .then(response => {
        setProducts(response)
        setFilteredProducts(response)
      })
      .catch(() => setProducts([]))
    }
  },[loading])

  const filterContents = () => {
    let tempArray = products.slice();
    if(nameQuery !== ""){
        tempArray = tempArray.filter(element => element.name === nameQuery)
    }

    setFilteredProducts(tempArray);
  }

  const addNewStock = (item,value) => {
    console.log(item,value)
    let tempArray = updatedProduct.slice();
    let newItem = {...item}
    let index = tempArray.findIndex(element => element.id === item.id)
    if(index !== -1){
      newItem = tempArray[index];
      newItem.stock = item.stock ? Number(item.stock)+Number(value) : value;
     } 
     else {
        newItem.stock = item.stock ? Number(item.stock)+Number(value) : value;
        tempArray.push(newItem);
    }
    console.log('tempArray=====',tempArray)
    setUpdatedProduct(tempArray);
    console.log("Updated",tempArray)
  }

  const updateProductStocks = () => {
      setLoading(true)
      MultipleStockUpdate(updatedProduct).then(() => setLoading(false))
  }

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // ** Function in get data on page change
  const handlePagination = page => {
    
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    const value = parseInt(e.currentTarget.value)
    setRowsPerPage(value)
  }

  // ** Function in get data on search query change
  const handleFilter = val => {
    setSearchTerm(val)
    let tempArray = products.slice();
    if(val !== ""){
        tempArray = tempArray.filter(element => element.name.toLowerCase().includes(val.toLowerCase()) && element)
    }

    setFilteredProducts(tempArray);
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
    } else if (filteredProducts.length === 0 ) {
      return []
    } else {
      return filteredProducts.slice(0, rowsPerPage)
    }
  }

  return (
  loading ? (
    <div className='fallback-spinner'>
      <div className='loading component-loader'>
        <div className='effect-1 effects'></div>
      </div>
    </div>
  ) : (
  <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Stocks</CardTitle>
        </CardHeader>
        </Card>

        <Card>
        <CardHeader>
        <CustomHeader
              toggleSidebar={toggleSidebar}
              handlePerPage={handlePerPage}
              rowsPerPage={rowsPerPage}
              searchTerm={searchTerm}
              handleFilter={handleFilter}
            />
        </CardHeader>
        <CardBody>
        <Table hover responsive className="mb-0">
            <thead>
            <tr>
                <th className="green-text">Name</th>
                <th className="green-text">Sell Price</th>
                <th className="green-text">HSN Code</th>
                <th className="green-text">UOM</th>
                <th className="green-text">Last Updated</th>
                <th className="green-text">Current Stock</th>
                <th className="green-text">New Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item,index) => {
                  return (
                    <tr key = {index}>
                      <td>{item.name}</td>
                      <td>{item.sellPrice}</td>
                      <td>{item.hsnCode}</td>
                      <td>{item.unit}</td>
                      <td>{item.lastUpdated}</td>
                      <td>{item.stock}</td>
                      <td>
                        <Input onChange = {(e) => addNewStock(item,e.target.value)}/>
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
          <Button.Ripple color='primary' onClick = {() => {updateProductStocks()}}>
            Save
          </Button.Ripple>
          </Col>
        </Row>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  )
  )
}

export default UsersList
