import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Form, Row, Col, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPrint,
  faList,
  faPlusSquare,
  faListAlt,
  faPlus,
  faEdit,
  faChevronDown,
  faTrash,
  faDownload
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import Button from "../UserComponents/Button";
import { fetchSalesInvoice } from '../Services/FirebaseSerice';
import "./index.scss";

const Export = (props) => {

  const history = useHistory();

  return (
    <div className="screen-stocks">
      <Card className="card-style mb-4">
        <Card.Text className="card-title pb-2">
            <FontAwesomeIcon icon={faSearch} className="mr-2 mt-3" />
                    Search Product
        </Card.Text>
        <Card.Text className="ml-3 mr-3">
            <Form>
                <Row>
                    <Col xs={12} sm={6} md={3} >
                        <Form.Group controlId="productName">
                            <Form.Label>Search By Product Name :</Form.Label>
                            <Form.Control
                                as="select"
                            >
                                <option>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                                <option>May</option>
                                <option>June</option>
                                <option>July</option>
                                <option>August</option>
                                <option>September</option>
                                <option>October</option>
                                <option>November</option>
                                <option>December</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={3} >
                        <Form.Group controlId="productName">
                            <Form.Label>.</Form.Label>
                            <Form.Control
                                as="select"
                            >
                                <option>2021</option>
                                <option>2020</option>
                                <option>2019</option>
                                <option>2018</option>
                                <option>2017</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={3} className="d-flex mb-3 justify-content-xs-center justify-content-sm-center justify-content-md-end mt-4">
                        <Button
                            name="Download"
                            havingIcon={true}
                            iconType={faDownload}
                            buttonType="btn btn-primary"
                            onClick = {() => {
                                var element = document.createElement('a');
                                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent("{\"gstin\":\"33DIRPA9012C1ZN\",\"fp\":\"032021\",\"version\":\"GST3.0.1\",\"hash\":\"hash\",\"b2b\":[{\"ctin\":\"33DDAPK6662Q1Z2\",\"inv\":[{\"inum\":\"1218\",\"idt\":\"02-03-2021\",\"val\":525,\"pos\":\"33\",\"rchrg\":\"N\",\"inv_typ\":\"R\",\"itms\":[{\"num\":1201,\"itm_det\":{\"txval\":468.73,\"rt\":12,\"camt\":28.12,\"samt\":28.12,\"csamt\":0}}]},{\"inum\":\"1293\",\"idt\":\"09-03-2021\",\"val\":1058.7,\"pos\":\"33\",\"rchrg\":\"N\",\"inv_typ\":\"R\",\"itms\":[{\"num\":1801,\"itm_det\":{\"txval\":897.2,\"rt\":18,\"camt\":80.75,\"samt\":80.75,\"csamt\":0}}]},{\"inum\":\"1369\",\"idt\":\"17-03-2021\",\"val\":300,\"pos\":\"33\",\"rchrg\":\"N\",\"inv_typ\":\"R\",\"itms\":[{\"num\":1201,\"itm_det\":{\"txval\":267.84,\"rt\":12,\"camt\":16.07,\"samt\":16.07,\"csamt\":0}}]},{\"inum\":\"1401\",\"idt\":\"23-03-2021\",\"val\":1378,\"pos\":\"33\",\"rchrg\":\"N\",\"inv_typ\":\"R\",\"itms\":[{\"num\":1801,\"itm_det\":{\"txval\":1167.8,\"rt\":18,\"camt\":105.1,\"samt\":105.1,\"csamt\":0}}]}]},{\"ctin\":\"33BBOPR5843L1Z0\",\"inv\":[{\"inum\":\"1254\",\"idt\":\"03-03-2021\",\"val\":2026.8,\"pos\":\"33\",\"rchrg\":\"N\",\"inv_typ\":\"R\",\"itms\":[{\"num\":1801,\"itm_det\":{\"txval\":1717.63,\"rt\":18,\"camt\":154.59,\"samt\":154.59,\"csamt\":0}}]},{\"inum\":\"1370\",\"idt\":\"17-03-2021\",\"val\":5741.3,\"pos\":\"33\",\"rchrg\":\"N\",\"inv_typ\":\"R\",\"itms\":[{\"num\":1801,\"itm_det\":{\"txval\":4865.51,\"rt\":18,\"camt\":437.9,\"samt\":437.9,\"csamt\":0}}]}]},{\"ctin\":\"33AVDPA4631M1ZU\",\"inv\":[{\"inum\":\"1262\",\"idt\":\"03-03-2021\",\"val\":457,\"pos\":\"33\",\"rchrg\":\"N\",\"inv_typ\":\"R\",\"itms\":[{\"num\":1201,\"itm_det\":{\"txval\":408.05,\"rt\":12,\"camt\":24.48,\"samt\":24.48,\"csamt\":0}}]},{\"inum\":\"1378\",\"idt\":\"17-03-2021\",\"val\":110,\"pos\":\"33\",\"rchrg\":\"N\",\"inv_typ\":\"R\",\"itms\":[{\"num\":501,\"itm_det\":{\"txval\":104.76,\"rt\":5,\"camt\":2.62,\"samt\":2.62,\"csamt\":0}}]},{\"inum\":\"1481\",\"idt\":\"31-03-2021\",\"val\":210,\"pos\":\"33\",\"rchrg\":\"N\",\"inv_typ\":\"R\",\"itms\":[{\"num\":501,\"itm_det\":{\"txval\":200,\"rt\":5,\"camt\":5,\"samt\":5,\"csamt\":0}}]}]}],\"b2cs\":[{\"sply_ty\":\"INTRA\",\"rt\":5,\"typ\":\"OE\",\"pos\":\"33\",\"txval\":21170.7,\"camt\":529.27,\"samt\":529.27,\"csamt\":0},{\"sply_ty\":\"INTRA\",\"rt\":12,\"typ\":\"OE\",\"pos\":\"33\",\"txval\":41668.56,\"camt\":2500.11,\"samt\":2500.11,\"csamt\":0},{\"sply_ty\":\"INTRA\",\"rt\":18,\"typ\":\"OE\",\"pos\":\"33\",\"txval\":120896.88,\"camt\":10880.72,\"samt\":10880.72,\"csamt\":0}]}"));
                                element.setAttribute('download', "file-export.json");

                                element.style.display = 'none';
                                document.body.appendChild(element);

                                element.click();
                            }}
                        />
                    </Col>
                </Row>
            </Form>
        </Card.Text>
    </Card>
    </div>
  );
}

export default Export;