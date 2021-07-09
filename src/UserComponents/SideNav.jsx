import { FaTachometerAlt,FaMoneyBillAlt,FaPrint,FaTruckMoving,FaUsers,FaCog } from 'react-icons/fa';
import React from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import "./index.scss";

const SideNav = (props) => {
    return(
        <ProSidebar>
            <Menu iconShape="circle">
                <MenuItem icon = {<FaTachometerAlt/>} onClick = {() => window.location.replace("/dashboard")}>Dashboard</MenuItem>
                <MenuItem icon = {<FaCog/>} onClick = {() => window.location.replace("/settings")}>Settings</MenuItem>
                <MenuItem icon = {<FaUsers/>} onClick = {() => window.location.replace("/customers")}>Customers</MenuItem>
                <MenuItem icon = {<FaTruckMoving/>} onClick = {() => window.location.replace("/transport")}>Transport</MenuItem>
                <SubMenu title="Products" icon={<FaMoneyBillAlt />}>
                    <MenuItem onClick = {() => window.location.replace("/products")}>Products</MenuItem>
                    <MenuItem onClick = {() => window.location.replace("/stocks")}>Stock</MenuItem>
                </SubMenu>
                <MenuItem icon = {<FaPrint/>} onClick = {() => window.location.replace("/salesinvoice")}>Sale Invoice</MenuItem>
                <MenuItem icon = {<FaPrint/>} onClick = {() => window.location.replace("/purchaseinvoice")}>Purcharse Invoice</MenuItem>
                {/* <MenuItem icon = {<FaMoneyBillAlt/>} onClick = {() => window.location.replace("/accountsummary")}>Payment Receipt</MenuItem> */}
                <SubMenu title="Payment Receipt" icon={<FaMoneyBillAlt />}>
                    <MenuItem onClick = {() => window.location.replace("/inwardPayment")}>Inward Payment</MenuItem>
                    <MenuItem onClick = {() => window.location.replace("/outwardPayment")}>Outward Payment</MenuItem>
                </SubMenu>
            </Menu>
        </ProSidebar>
    )
}

export default SideNav;