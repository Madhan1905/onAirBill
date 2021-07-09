import React, { useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import "firebase/auth"
import AuthenticationService from '../Services/AuthenticationService';
import { Context } from '../ContextComponent';
import { createUser, checkPaidUsers, registerUser, setPaidUsers, getUserData } from '../Services/FirebaseSerice';
import * as Constants from "./Constants";

const Login = (props) => {

    const [isRegister,setIsRegister] = useState(false);
    const [phoneNumber,setPhoneNumber] = useState("");
    const [otp,setOtp] = useState("");
    const [confirmationResult,setConfirmationResult] = useState();
    const [otpSent,setOtpSent] = useState(false);
    const [processing,setProcesing] = useState(false);
    const [isStaff,setIsStaff] = useState(false);
    const {setLoggedIn} = useContext(Context); 
    const [registrationDetails,setRegistrationDetails] = useState({
        name: "",
        organisationName: "",
        address: "",
        pincode: "",
        phone: phoneNumber,
        state: "",
        email: "",
        gstin: ""
    })
    const[showRegError,setShowRegError] = useState(false);
    const [regOtpSent,setRegOtpSent] = useState(false);

    useEffect(() => {
        //firebase.auth().signOut()
        firebase.auth().onAuthStateChanged((user) => {
            if(user !== null){
                if(!isRegister){
                    createUser(user.phoneNumber).then(() => {
                        getUserData(user.phoneNumber.slice(3,13)).then(data => {
                            sessionStorage.setItem("useData",JSON.stringify(data));
                            checkPaidUsers(user.phoneNumber, true).then(res => {
                                if(res === "Paid"){
                                    AuthenticationService.storeUserToken(user.phoneNumber);
                                    setLoggedIn(true);
                                    window.location.replace("/Dashboard");
                                }else if(res == "Sub Expired"){
                                    sessionStorage.setItem("phoneNumber",user.phoneNumber);
                                    sessionStorage.setItem("validityExpired",true);
                                    alert("Subscription expired, Please renew!");
                                    window.location.replace("/payment");
                                    setProcesing(false);
                                } else {
                                    //old one
                                    // sessionStorage.setItem("phoneNumber",user.phoneNumber);
                                    // window.location.replace("/payment");
                                    AuthenticationService.storeUserToken(user.phoneNumber);
                                    setLoggedIn(true);
                                    sessionStorage.setItem("phoneNumber",user.phoneNumber);
                                    window.location.replace("/Dashboard");
                                }
                            })
                        })
                    })
                }
            }
        })
      },[])

    useEffect(() => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
            }
        });
    },[])

    const checkRegister = (phone) => {
        checkPaidUsers("+91" + phone, false).then(res => {
            if(res == "Already Registered"){
                alert("User alreay registered please login.");
            } else {
                setIsRegister(true);
            }
        })
    }

    const checkUser = (phone, isCheckingFromLogin) =>{
        setProcesing(true);
        checkPaidUsers("+91" + phone, isCheckingFromLogin).then(res => {
            if(isCheckingFromLogin){
                if(res == "Valid User" || res == "Paid"){
                    senOtp(phone);
                }else if(res == "Invalid User"){
                    alert("Please register to continue.");
                    setProcesing(false);
                }else if(res == "Sub Expired"){
                    sessionStorage.setItem("phoneNumber","+91" + phone);
                    sessionStorage.setItem("validityExpired",true);
                    alert("Subscription expired, Please renew!");
                    window.location.replace("/payment");
                    setProcesing(false);
                }
                else if(res == false){
                    alert("Login Failed.");
                    setProcesing(false);
                }
            }
            else{
                if(res == "Already Registered"){
                    alert("User alreay registered please login.");
                    setProcesing(false);
                }else if(res == "Invalid User"){
                    senOtp(phone);
                }
                else if(res == false){
                    alert("Register Failed.");
                    setProcesing(false);
                }
            }
            
        });
    }
    const senOtp = (phone) => {
        setProcesing(true);
        const appVerifier = window.recaptchaVerifier;
        const number = "+91"+phone; 
        firebase.auth().signInWithPhoneNumber(number, appVerifier)
            .then((result) => {
                setConfirmationResult(result);
                setOtpSent(true);
                if(isRegister){
                    setRegOtpSent(true);
                }
                setProcesing(false);
            }).catch(err => {
                console.log("otp not sent" , err);
                alert("OTP not sent");
                setProcesing(false);
            });
    }

    const verifyOtp = async() => {
        setProcesing(true)
        confirmationResult.confirm(otp).then((result) => {
            console.log(result)
            if(isRegister){
                registerUser(registrationDetails).then(res => {
                    if(res == "Error"){
                        alert("Registration Failed");
                        setProcesing(false);
                    }
                    else if(res == "Registered"){
                        sessionStorage.setItem("useData",JSON.stringify(registrationDetails));
                        setPaidUsers(result.user.phoneNumber,"Registered").then(res => {
                            if(res == "Registered"){
                                sessionStorage.setItem("phoneNumber",result.user.phoneNumber);
                                window.location.replace("/payment");
                                setProcesing(false);
                            }
                            else if(res == false){
                                alert("Registration Failed");
                                setProcesing(false);
                            }
                        })
                    }
                    
                })
            }
          }).catch((error) => {
              console.log("Login failed", error);
              alert("OTP verification failed");
              setProcesing(false);
          });
    }

    const onChangeRegisterForm = (value,type) => {
        let tempObject = {...registrationDetails};
        tempObject[type] = value;
        setRegistrationDetails(tempObject);
    }

    return(
        <div className="modal login-modal" style = {{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <div className="modal-content animate">

                {!isRegister ? !isStaff ? <form className="container">
                    <label><b>Phone Number</b></label>
                    <input 
                        type="text" 
                        placeholder="Enter 10 digit phone number" 
                        value = {phoneNumber} 
                        required 
                        onChange = {(e) => {
                            e.target.value.length <= 10 && setPhoneNumber(e.target.value)
                            onChangeRegisterForm(e.target.value,"phone")
                        }}
                        autoFocus
                    />

                    {otpSent && <>
                        <label><b>OTP</b></label>
                        <input 
                            type="text" 
                            placeholder="Enter OTP" 
                            required
                            value = {otp}
                            onChange = {(e) => setOtp(e.target.value)}
                            autoFocus
                        />
                    </>}
                    
                    <div className = "d-flex column">
                        <button 
                            id="sign-in-button" 
                            type="submit" 
                            onClick = {(e) => {
                                e.preventDefault()
                                otpSent ? verifyOtp() : /*senOtp()*/ checkUser(phoneNumber, true)
                            }}
                            disabled = {processing || phoneNumber.length < 10}
                            style= {{marginRight: "2%"}}
                        >
                            {processing && <span className="spinner-border spinner-border-sm" role="status" />}
                            {!processing && <span>Login</span>}
                        </button>
                        {!otpSent && <button 
                            onClick = {(e) => {
                                e.preventDefault();
                                checkRegister(phoneNumber)
                            }}
                            disabled = {processing || phoneNumber.length < 10}
                            style= {{marginLeft: "2%"}}
                        >
                            Register
                        </button>}
                    </div>
                    
                </form> :
                <form className="container">
                    <label><b>Email Id</b></label>
                    <input 
                        type="text" 
                        placeholder="Enter Email ID" 
                        value = {phoneNumber} 
                        required 
                        onChange = {(e) => setPhoneNumber(e.target.value)}
                    />

                    <label><b>Password</b></label>
                    <input 
                        type="password" 
                        placeholder="Enter password" 
                        required
                        value = {otp}
                        onChange = {(e) => setOtp(e.target.value)}
                    />
                    
                    <button  
                        type="submit" 
                        onClick = {(e) => {
                            e.preventDefault()
                            firebase.auth().signInWithEmailAndPassword(phoneNumber, otp)
                                .then(result => {
                                    console.log(result)
                                    AuthenticationService.storeUserToken(result.user.phoneNumber);
                                    setLoggedIn(true);
                                    props.history.push("/Dashboard")
                                }).catch((error) => {
                                    console.log(error)
                                    console.log("Login failed")
                                });
                        }}
                        disabled = {processing}
                    >
                        Login
                    </button>
                </form> : !regOtpSent ?
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
                        <label className = "col-4"><b>Email-id*:</b></label>
                        <input 
                            className = {`col-7 form-control ${(showRegError && registrationDetails.email === "") && "is-invalid"}`}
                            value  = {registrationDetails.email}
                            onChange = {(e) => onChangeRegisterForm(e.target.value,"email")}
                        />
                    </div>
                    <div className = "d-flex row mb-4">
                        <label className = "col-4"><b>GSTIN:</b></label>
                        <input 
                            className = {`col-7 form-control`}
                            value  = {registrationDetails.gstin}
                            onChange = {(e) => e.target.value.length <= 15 && onChangeRegisterForm(e.target.value,"gstin")}
                        />
                    </div>

                    <button  
                        id = "sign-in-button"
                        type="submit" 
                        onClick = {(e) => {
                            e.preventDefault();
                            let valid = true;
                            Object.keys(registrationDetails).map(key => {
                                if(key !== "gstin" && !key.includes("address") && registrationDetails[key] === ""){
                                    valid = false;
                                }
                            })
                            if(valid){
                                checkUser(registrationDetails.phone, false);
                                //senOtp(registrationDetails.phone);
                            } else {
                                setShowRegError(true)
                            }
                            
                        }}
                    >
                        {processing && <span className="spinner-border spinner-border-sm" role="status" />}
                        {!processing && <span>Register</span>}
                    </button>
                </form> : 
                <div className="container">
                    <label><b>Verify Phone Number</b></label>
                    <input 
                        type="text" 
                        placeholder="Enter OTP" 
                        required
                        value = {otp}
                        onChange = {(e) => setOtp(e.target.value)}
                    />
                    
                    <button 
                        id="sign-in-button" 
                        type="submit" 
                        onClick = {() => {verifyOtp()}}
                        disabled = {processing}
                    >
                        {processing && <span className="spinner-border spinner-border-sm" role="status" />}
                        {!processing && <span>Register</span>}
                    </button>
                </div>}

                <div className="container login-links" style={{backgroundColor:'#f1f1f1'}}>
                    <div className = "link" onClick = {() => setIsRegister(!isRegister)}>
                        {isRegister && "Already a member? Login"}
                    </div>
                    {!isRegister && <div>
                        <span className="link" onClick = {() => setIsStaff(!isStaff)}>
                            {!isStaff ? 'Staff Login' : 'Client Login'}
                        </span>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Login;