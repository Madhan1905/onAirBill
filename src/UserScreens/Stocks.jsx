import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Row, Col, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPrint,
  faList,
  faPlus,
  faEdit,
  faTrash,
  faSave
} from "@fortawesome/free-solid-svg-icons";
//import Button from "../UserComponents/Button";

//third party packages
import { Card, CardHeader, CardTitle, CardText, CardBody, Input, Label, CustomInput, Button } from 'reactstrap'

//scss
import "./index.scss";
import { deleteProducts, fetchProducts, MultipleStockUpdate } from '../Services/FirebaseSerice';
const Stocks = () => {
  const history = useHistory()
  const [products,setProducts] = useState([]);
  const [nameQuery,setNameQuery] = useState("");
  const [filteredProducts,setFilteredProducts] = useState([]);
  const [loading,setLoading] = useState(false);
  const [updatedProduct,setUpdatedProduct] = useState([]);

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

  

  const updateProductStocks = () => {
      setLoading(true)
      MultipleStockUpdate(updatedProduct).then(() => setLoading(false))
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle tag='h4'>Stocks</CardTitle>
        </CardHeader>
        </Card>
      {/* <Card>
        <CardText className="card-title pb-2">
            <FontAwesomeIcon icon={faSearch} className="mr-2 mt-3" />
                    Search Product
        </CardText>
        <CardText className="ml-3 mr-3">
            <Form>
                <Row>
                    <Col xs={12} sm={6} md={3} >
                        <Form.Group controlId="productName">
                            <Form.Label>Search By Product Name :</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Product Name"
                                value = {nameQuery}
                                onChange = {(e) => setNameQuery(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="d-flex mb-3 justify-content-xs-center justify-content-sm-center justify-content-md-end mt-4">
                        <Button
                            name="Search"
                            havingIcon={true}
                            iconType={faPrint}
                            buttonType="btn btn-primary"
                            onClick = {() => filterContents()}
                        />
                        &nbsp;&nbsp;
                        <Button
                            name="Show All Data"
                            havingIcon={true}
                            iconType={faSearch}
                            buttonType="btn btn-primary"
                            onClick = {() => setFilteredProducts(products)}
                        />
                    </Col>
                </Row>
            </Form>
        </CardText>
    </Card> */}

      <Card className="card-style mb-4">
        <CardText className="card-title pb-2 d-flex justify-content-between m-0">
          <div>
            <FontAwesomeIcon icon={faList} className="mr-2 mt-3" />
            Product List
          </div>
          <div className="d-flex justify-content-end align-items-end">
            <Button
              name="Add New"
              havingIcon={true}
              iconType={faPlus}
              buttonType="btn btn-primary"
              onClick={() => history.push("/addproduct")}
            />

          </div>
        </CardText>
        <CardText>
          <Table bordered striped hover responsive="sm" className="mb-0">
            <colgroup>
              <col span = "1" style = {{width:"20%"}}/>
              <col span = "1" style = {{width:"10%"}}/>
              <col span = "1" style = {{width:"10%"}}/>
              <col span = "1" style = {{width:"10%"}}/>
              <col span = "1" style = {{width:"10%"}}/>
              <col span = "1" style = {{width:"10%"}}/>
              <col span = "1" style = {{width:"20%"}}/>
            </colgroup>
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
                        <input onChange = {(e) => addNewStock(item,e.target.value)}/>
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
        </CardText>
      </Card>

      <Card className="card-style mb-4">
            <CardText className="card-title pb-4 pt-4">
                <div className="d-flex justify-content-between">
                    <div>
                        <Button
                            name="Save"
                            havingIcon={true}
                            iconType={faSave}
                            buttonType="btn btn-primary"
                            onClick = {() => {updateProductStocks()}}
                        />
                    </div>
                </div>
            </CardText>
        </Card>
    </div>
  );
}

export default Stocks;