import React, { useEffect, useState } from 'react';
import { createUser, registerUser } from '../Services/FirebaseSerice';
import * as Constants from "./Constants";

const Profile = () => {

    const [registrationDetails,setRegistrationDetails] = useState(sessionStorage.getItem("useData") ? JSON.parse(sessionStorage.getItem("useData")):
    {
        name: "",
        organisationName: "",
        address1: "",
        address2: "",
        phone: "",
        state: "",
        email: "",
        gstin: ""
    })
    const[showRegError,setShowRegError] = useState(false);
    const [processing,setProcesing] = useState(false);

    const onChangeRegisterForm = (value,type) => {
        let tempObject = {...registrationDetails};
        tempObject[type] = value;
        setRegistrationDetails(tempObject);
    }

    return(
        <div className="screen-stocks">
            <form className = "container form-group">
                <div className = "d-flex row mb-4">
                    <label className = "col-4"><b>Name*:</b></label>
                    <input 
                        className = {`col-7 form-control ${(showRegError && registrationDetails.name === "") && "is-invalid"}`}
                        value  = {registrationDetails.name}
                        onChange = {(e) => onChangeRegisterForm(e.target.value,"name")}
                    />
                </div>
                <div className = "d-flex row mb-4">
                    <label className = "col-4"><b>Organisation Name*:</b></label>
                    <input 
                        className = {`col-7 form-control ${(showRegError && registrationDetails.organisationName === "") && "is-invalid"}`} 
                        value  = {registrationDetails.organisationName}
                        onChange = {(e) => onChangeRegisterForm(e.target.value,"organisationName")}
                    />
                </div>
                <div className = "d-flex row mb-4">
                    <label className = "col-4"><b>Phone*:</b></label>
                    <input 
                        className = {`col-7 form-control`} 
                        value  = {registrationDetails.phone}
                        readOnly
                    />
                </div>
                <div className = "d-flex row mb-4">
                    <label className = "col-4"><b>Address:</b></label>
                    <textarea 
                        className = {`col-7 form-control`}
                        placeholder = "Enter No.,street,city"
                        value  = {registrationDetails.address}
                        onChange = {(e) => onChangeRegisterForm(e.target.value,"address")}
                    />
                </div>
                <div className = "d-flex row mb-4">
                    <label className = "col-4"><b>Pincode:</b></label>
                    <input 
                        className = {`col-7 form-control`}
                        value  = {registrationDetails.pincode}
                        onChange = {(e) => onChangeRegisterForm(e.target.value,"pincode")}
                    />
                </div>
                <div className = "d-flex row mb-4">
                    <label className = "col-4"><b>State*:</b></label>
                    <select 
                        className = {`col-7 form-control ${(showRegError && registrationDetails.state === "") && "is-invalid"}`}
                        value = {registrationDetails.state}
                        onChange = {(e) => onChangeRegisterForm(e.target.value,"state")}
                    >
                        <option value  ="">Select State</option>
                        {Constants.states.map((item) => (
                            <option key = {item.state_name} value = {item.state_name}>
                                {item.state_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className = "d-flex row mb-4">
                    <label className = "col-4"><b>Email-id:</b></label>
                    <input 
                        className = {`col-7 form-control`}
                        value  = {registrationDetails.email}
                        onChange = {(e) => onChangeRegisterForm(e.target.value,"email")}
                    />
                </div>
                <div className = "d-flex row mb-4">
                    <label className = "col-4"><b>GSTIN:</b></label>
                    <input 
                        className = {`col-7 form-control`}
                        value  = {registrationDetails.gstin}
                        onChange = {(e) => onChangeRegisterForm(e.target.value,"gstin")}
                    />
                </div>

                <div className = "d-flex justify-content-center">
                    <button  
                        className = "btn btn-primary"
                        type="submit" 
                        onClick = {(e) => {
                            e.preventDefault();
                            setProcesing(true);
                            let valid = true;
                            Object.keys(registrationDetails).map(key => {
                                if(key !== "email" && key !== "gstin" && !key.includes("address") && registrationDetails[key] === ""){
                                    valid = false;
                                }
                            })
                            
                            if(valid){
                                registerUser(registrationDetails).then(() => {
                                    sessionStorage.setItem("useData",JSON.stringify(registrationDetails))
                                    setProcesing(false);
                                })
                            } else {
                                setShowRegError(true)
                            }
                            
                        }}
                    >
                        {processing && <span className="spinner-border spinner-border-sm" role="status" />}
                        {!processing && <span>Save</span>}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Profile;