import React from 'react';
import { Page, Document, StyleSheet,Text, View,PDFViewer } from '@react-pdf/renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';


const styles = StyleSheet.create({
    
    mainPage: {
        padding: 10
    },
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 20,
        paddingLeft:20,
        paddingRight:30,
        lineHeight: 1.5,
        flexDirection: 'column',
        borderWidth: 2,
        borderColor: "black",
    }, 
    logo: {
        width: 74,
        height: 66,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    titleContainer:{
        flexDirection: 'row',
        marginTop: 24,
    },
    invoiceNoContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    invoiceDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    invoiceDate: {
            fontSize: 12,
            fontStyle: 'bold',
    },
    label: {
        width: 60
    },
    headerContainer: {
        marginTop: 36
    },
    billTo: {
        marginTop: 20,
        paddingBottom: 3,
        fontFamily: 'Helvetica'
    },
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: 'black',
    },
    container: {
        flexDirection: 'row',
        borderBottomColor: 'black',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
    },
    description: {
        width: '45%',
        borderRightColor: 'black',
        borderRightWidth: 1,
    },
    qty: {
        width: '10%',
        borderRightColor: 'black',
        borderRightWidth: 1,
    },
    rate: {
        width: '15%',
        borderRightColor: 'black',
        borderRightWidth: 1,
    },
    hsn: {
        width: '30%',
        borderRightColor: 'black',
        borderRightWidth: 1,
    },
    amount: {
        width: '15%'
    },
    row: {
        flexDirection: 'row',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    description: {
        width: '60%',
        textAlign: 'left',
        borderRightColor: 'black',
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    qty: {
        width: '10%',
        borderRightColor: 'black',
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rate: {
        width: '15%',
        borderRightColor: 'black',
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount: {
        width: '20%',
        textAlign: 'right',
        paddingRight: 8,
    },
    ow: {
        flexDirection: 'row',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontSize: 12,
        fontStyle: 'bold',
    },
    description: {
        width: '85%',
        textAlign: 'left',
        borderRightColor: 'black',
        borderRightWidth: 1,
        paddingRight: 8,
    },
    total: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
    titleContainer:{
        flexDirection: 'row',
        marginTop: 12
    },
    reportTitle:{
        fontSize: 24,
        fontFamily: "Courier-Bold",
        textTransform: 'uppercase',
    },
    rowParent: {
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between"
    },
    invoiceTitle: {
        marginTop: 24,
        alignItems: "center",
        fontFamily: "Helvetica-Bold",
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderColor: "black"
    },
    boldText: {
        fontFamily: "Helvetica-Bold",
    },
    borderbox: {
        borderRightWidth: 1,
        borderColor: "black"
    }
  });

const PrintScreen = (props) => {

    const selfDetails = JSON.parse(sessionStorage.getItem("useData"));

    return(
        <div className="modal login-modal" style = {{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div className="animate" style = {{width:"70%",backgroundColor:"white"}}>
                <div className = "d-flex justify-content-end">
                    <FontAwesomeIcon size = "lg" icon = {faTimesCircle} onClick = {() => props.close()}/>
                </div>
                <PDFViewer width="100%" height="600" className="app" >
                    <Document>
                        <Page size="A4" style={styles.mainPage}>
                            <View style={styles.page}>
                                <View style = {[styles.rowParent,{justifyContent:"space-between",alignItems:"center"}]}>
                                    <View></View>
                                    <Text style={styles.reportTitle}>{props.invoice.customer.customerName}</Text>
                                    <Text >GST No:{selfDetails.gstin}</Text>
                                </View>
                                <View style = {{borderWidth:"2",borderColor:'black'}}>
                                    <View style = {styles.rowParent}>
                                        <View>
                                            <Text style={styles.billTo}>{props.type === "sale" ? "Bill To:" : "Bill From"}</Text>
                                            <Text style = {styles.boldText}>{props.invoice.customer.customerName}</Text>
                                            <Text>{props.invoice.customer.address1+props.invoice.customer.address2}</Text>
                                            <Text style = {styles.boldText}>{selfDetails.gstin}</Text>
                                            <Text>{props.invoice.customer.contactNo}</Text>
                                        </View>

                                        <View>
                                            <Text style={styles.billTo}>Shipping Address:</Text>
                                            <Text style = {styles.boldText}>{selfDetails.name}</Text>
                                            <Text>{selfDetails.address}</Text>
                                            <Text>{`${selfDetails.state} - ${selfDetails.pincode}`}</Text>
                                            <Text>{selfDetails.phone}</Text>
                                        </View>

                                        <View>
                                            <Text style={styles.billTo}>Invoice No:{props.invoice.invoiceNo}</Text>
                                            <Text>Date:{props.invoice.date}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style = {styles.invoiceTitle}>
                                    <Text>{props.type === "sale" ? 'Sales Invoice' : 'Tax Invoice'}</Text>
                                </View>
                                <View style={styles.tableContainer}>
                                    <View style={styles.container}>
                                        <Text style={styles.description}>Item Description</Text>
                                        <Text style={styles.hsn}>HSN/SAC</Text>
                                        <Text style={styles.rate}>QTY</Text>
                                        <Text style={styles.rate}>Price</Text>
                                        <Text style={styles.rate}>IGST</Text>
                                        <Text style={styles.rate}>SGST</Text>
                                        <Text style={styles.rate}>CGST</Text>
                                        <Text style={styles.amount}>Amt</Text>
                                    </View>

                                    {props.invoice.products.map((item,index) => (
                                        <View style={styles.row} key={index}>
                                            <Text style={styles.description}>{item.productName}</Text>
                                            <Text style={styles.hsn}>{item.product_sacCode}</Text>
                                            <Text style={styles.rate}>{item.product_qty}</Text>
                                            <Text style={styles.rate}>{item.product_price}</Text>
                                            <Text style={styles.rate}>{item.product_Igst}</Text>
                                            <Text style={styles.rate}>{item.product_Sgst}</Text>
                                            <Text style={styles.rate}>{item.product_Cgst}</Text>
                                            <Text style={styles.amount}>
                                                {((item.product_Igst/100)*(item.product_price*item.product_qty)
                                                    + (item.product_Cgst/100)*(item.product_price*item.product_qty)
                                                    + (item.product_Sgst/100)*(item.product_price*item.product_qty)
                                                    +(item.product_price*item.product_qty)).toFixed(2)}
                                            </Text>
                                        </View>
                                    ))}
                                    
                                    <View style={styles.row}>
                                        <Text style={styles.description}>TOTAL</Text>
                                        <Text style={styles.total}>{props.invoice.tax + props.invoice.total}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.description}>Roundoff</Text>
                                        <Text style={styles.total}>{props.invoice.roundoff}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.description}>GRAND TOTAL</Text>
                                        <Text style={styles.total}>{props.invoice.roundoffType === "plus" ? (props.invoice.tax + props.invoice.total)+Number(props.invoice.roundoff) : (props.invoice.tax + props.invoice.total)-Number(props.invoice.roundoff)}</Text>
                                    </View>
                                </View>

                                <View style={{alignItems:"center"}}>
                                    <Text>Thank you for your business</Text>
                                </View>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            </div>
        </div>
    )
}

export default PrintScreen;