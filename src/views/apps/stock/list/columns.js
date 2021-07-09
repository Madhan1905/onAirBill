// ** React Imports
import { useState } from 'react';
import { Link } from 'react-router-dom';

// ** Custom Components
import Avatar from '@components/avatar'

// ** Store & Actions
import { getUser, deleteUser } from '../store/action'
import { store } from '@store/storeConfig/store'

// ** Third Party Components
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { MoreVertical, FileText, Trash2, Archive } from 'react-feather'

const addNewStock = (item,value) => {
  let tempArray = updatedProduct.slice();
  let newItem = {...item}
  let index = tempArray.findIndex(element => element.id === item.id)

  if(index !== -1){
      newItem = tempArray[index];
      newItem.stock = item.stock ? Number(item.stock)+Number(value) : value;
  } else {
      newItem.stock = item.stock ? Number(item.stock)+Number(value) : value;
      tempArray.push(newItem);
  }
  setUpdatedProduct(tempArray);
  console.log("Updated",tempArray)
}

export const columns = [
  {
    name: 'NAME',
    minWidth: '250px',
    selector: 'name',
    sortable: true,
    cell: row => row.name
  },
  {
    name: 'SELL PRICE',
    minWidth: '100px',
    selector: 'sellPrice',
    sortable: true,
    cell: row => row.sellPrice
  },
  {
    name: 'HSN CODE',
    minWidth: '100px',
    selector: 'hsnCode',
    sortable: false,
    cell: row => row.hsnCode
  },
  {
    name: 'UOM',
    minWidth: '138px',
    selector: 'unit',
    sortable: false,
    cell: row => row.unit
  },
  {
    name: 'LAST UPDATED',
    minWidth: '138px',
    selector: 'lastUpdated',
    sortable: true,
    cell: row => row.lastUpdated
  },
  {
    name: 'CURRENT STOCK',
    minWidth: '138px',
    selector: 'stock',
    sortable: true,
    cell: row => row.stock
  },
  {
    name: 'NEW STOCK',
    minWidth: '138px',
    selector: 'status',
    sortable: true,
    cell: row => (
    <input className="form-control" onChange = {(e) => addNewStock(row, e.target.value)}/>
    )
  },
  {
    name: 'Actions',
    minWidth: '100px',
    cell: row => (
      <UncontrolledDropdown>
        <DropdownToggle tag='div' className='btn btn-sm'>
          <MoreVertical size={14} className='cursor-pointer' />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            tag={Link}
            to={`/apps/user/view/${row.id}`}
            className='w-100'
            onClick={() => store.dispatch(getUser(row.id))}
          >
            <FileText size={14} className='mr-50' />
            <span className='align-middle'>Details</span>
          </DropdownItem>
          <DropdownItem
            tag={Link}
            to={`/apps/user/edit/${row.id}`}
            className='w-100'
            onClick={() => store.dispatch(getUser(row.id))}
          >
            <Archive size={14} className='mr-50' />
            <span className='align-middle'>Edit</span>
          </DropdownItem>
          <DropdownItem className='w-100' onClick={() => store.dispatch(deleteUser(row.id))}>
            <Trash2 size={14} className='mr-50' />
            <span className='align-middle'>Delete</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    )
  }
]
