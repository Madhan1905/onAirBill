import React, { useContext, useEffect, useState, useRef } from 'react';
import firebase from 'firebase/app';
import "firebase/auth"
import AuthenticationService from '../../../Services/AuthenticationService';
import { Context } from '../../../ContextComponent';
import { createUser, checkPaidUsers, registerUser, setPaidUsers, getUserData } from '../../../Services/FirebaseSerice';
import * as Constants from "../../../UserScreens/Constants";
import Header from '../../../UserComponents/Header';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert, Input } from 'reactstrap'
import { Row, Col } from "react-bootstrap";
import Card from './Card/index'

// images
import background from '../../../Images/dotBackground.png';
import staff from '../../../Images/staff.png';
import gst from '../../../Images/gst.png';
import product from '../../../Images/product.png';
import payment from '../../../Images/payment.png';

//scss
import '../../../Styles/home.scss';


const Login = (props) => {
    const featureRef = useRef(null)
    const aboutRef = useRef(null)
    const [showLogin, setLogin] = useState(false);
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
                                    window.location.replace("/dashboard/ecommerce");
                                }else if(res == "Sub Expired"){
                                    sessionStorage.setItem("phoneNumber",user.phoneNumber);
                                    sessionStorage.setItem("validityExpired",true);
                                    alert("Subscription expired, Please renew!");
                                    window.location.replace("/payment");
                                    setProcesing(false);
                                } else {
                                    sessionStorage.setItem("phoneNumber",user.phoneNumber);
                                    window.location.replace("/payment");
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

    const gstCardData = [
      {
        id: 1,
        type: 'gst',
        icon: gst,
        header: "GST Invoices",
        content: "Our all documents are beautifully designed & compliant with GST with rules and regulations",
      },
      {
        id: 2,
        icon: product,
        type: 'gst',
        header: "Product & Stock",
        content: "Our all documents are beautifully designed & compliant with GST with rules and regulations",
      },
      {
        id: 3,
        icon: staff,
        type: 'gst',
        header: "Staff Account",
        content: "Our all documents are beautifully designed & compliant with GST with rules and regulations",
      },
      {
        id: 4,
        icon: payment,
        type: 'gst',
        header: "Payment Receipt",
        content: "Our all documents are beautifully designed & compliant with GST with rules and regulations",
      }
    ]

    const infoCardData = [
      {
        id: 1,
        type: 'info',
        icon: gst,
        header: "GST Invoices",
        content: "Our all documents are beautifully designed & compliant with GST with rules and regulations",
      },
      {
        id: 2,
        icon: product,
        type: 'info',
        header: "Product & Stock",
        content: "Our all documents are beautifully designed & compliant with GST with rules and regulations",
      },
      {
        id: 3,
        icon: staff,
        type: 'info',
        header: "Staff Account",
        content: "Our all documents are beautifully designed & compliant with GST with rules and regulations",
      },
      {
        id: 4,
        icon: payment,
        type: 'info',
        header: "Payment Receipt",
        content: "Our all documents are beautifully designed & compliant with GST with rules and regulations",
      }
    ]

    const eventScrollView = (val) => {
      if(val === 'Feature') {
        console.log("Feature")
        featureRef.current.scrollIntoView()
      } else if( val === 'about') {
        aboutRef.current.scrollIntoView()
      } else if(val === 'login') {
        setLogin(true)
      }
    }
    return(
      <>
      <Header onClick={eventScrollView}/>
      <div id="homeContainer">
            <div className="main-content">
                <div className="home-content">
                    {/* <img src={background} className="background" width="100%" /> */}
                    <h2 className="white">GST Billing Software For</h2>
                    <h2 className="white">Every Bussiness</h2>
                    <button className="button-style mt-4">GET STARTED</button>
                    <img src={background} className="background" width="100%" /> 
                    <Row className="gst-div" ref={featureRef}>
                      <Col sm={12} md={3} className="gst-div-text">
                        <h3 className="white">{`Easy & secure GST Billing Software`}</h3>
                        <br/>
                        <div className="white">Best GST Billing Software For Small and medium Bussiness</div>
                      </Col>
                      <Col sm={12} md={9} className="gst-div-card">
                        {gstCardData.map( item => 
                        <Card item={item} />
                      )}
                      </Col>
                      </Row>
                      <Row >
                        <Col sm={12} className="view-feature">
                        <button className="button-style mt-4">VIEW ALL FEATURES</button>
                        </Col>
                      </Row>
                      <Row className="description-card mb-5" ref={aboutRef}>
                      <Col sm={12} md={3} className="mt-5 pt-5">
                        <h3 className="white">Why you should use on Air Bill?</h3>
                        <br/>
                        <div className="white">Best GST Billing Software For Small and medium Bussiness</div>
                      </Col>
                      <Col sm={12} md={9} className="mt-1">
                        <Row>
                        {infoCardData.map( item => 
                        <Col sm={12} md={3}>
                        <Card item={item} />
                        </Col>
                      )}
                      </Row>
                      </Col>
                      </Row>
                      
                </div>
            </div>

            <Modal isOpen={showLogin} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Client Login</ModalHeader>
          <ModalBody>
            
            {!isRegister && !isStaff &&
          <form className="container">
                    <label><b>Phone Number</b></label>
                    <Input
                    className="mb-2" 
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
                        <Input 
                        className="mb-2" 
                            type="text" 
                            placeholder="Enter OTP" 
                            required
                            value = {otp}
                            onChange = {(e) => setOtp(e.target.value)}
                            autoFocus
                        />
                    </>}
                    
                    <div className = "d-flex column">
                        <Button.Ripple
                        color="primary" 
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
                        </Button.Ripple>
                        {!otpSent && <Button.Ripple 
                        color="primary"
                            onClick = {(e) => {
                                e.preventDefault();
                                checkRegister(phoneNumber)
                            }}
                            disabled = {processing || phoneNumber.length < 10}
                            style= {{marginLeft: "2%"}}
                        >
                            Register
                        </Button.Ripple>}
                    </div>
                    
                </form>}
                {!isRegister && isStaff && 
                <form className="container">
                <label><b>Email Id</b></label>
                <Input 
                    type="text" 
                    placeholder="Enter Email ID" 
                    value = {phoneNumber} 
                    required 
                    onChange = {(e) => setPhoneNumber(e.target.value)}
                />

                <label><b>Password</b></label>
                <Input 
                    type="password" 
                    placeholder="Enter password" 
                    required
                    value = {otp}
                    onChange = {(e) => setOtp(e.target.value)}
                />
                
                <Button.Ripple  
                    type="submit" 
                    onClick = {(e) => {
                        e.preventDefault()
                        firebase.auth().signInWithEmailAndPassword(phoneNumber, otp)
                            .then(result => {
                                console.log(result)
                                AuthenticationService.storeUserToken(result.user.phoneNumber);
                                setLoggedIn(true);
                                props.history.push("/dashboard/ecommerce")
                            }).catch((error) => {
                                console.log(error)
                                console.log("Login failed")
                            });
                    }}
                    disabled = {processing}
                >
                    Login
                </Button.Ripple>
            </form>
                }
                {isRegister && !regOtpSent && <form className = "container form-group">
                    <div className = "d-flex row mb-4">
                        <label className = "col-4"><b>Name*:</b></label>
                        <Input 
                            className = {`col-7 form-control ${(showRegError && registrationDetails.name === "") && "is-invalid"}`}
                            value  = {registrationDetails.name}
                            onChange = {(e) => onChangeRegisterForm(e.target.value,"name")}
                        />
                    </div>
                    <div className = "d-flex row mb-4">
                        <label className = "col-4"><b>Organisation Name*:</b></label>
                        <Input 
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
                        <Input 
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
                        <Input 
                            className = {`col-7 form-control ${(showRegError && registrationDetails.email === "") && "is-invalid"}`}
                            value  = {registrationDetails.email}
                            onChange = {(e) => onChangeRegisterForm(e.target.value,"email")}
                        />
                    </div>
                    <div className = "d-flex row mb-4">
                        <label className = "col-4"><b>GSTIN:</b></label>
                        <Input 
                            className = {`col-7 form-control`}
                            value  = {registrationDetails.gstin}
                            onChange = {(e) => e.target.value.length <= 15 && onChangeRegisterForm(e.target.value,"gstin")}
                        />
                    </div>
                    <div className = "d-flex row mb-4">
                        <label className = "col-4"><b>Bussiness Type:</b></label>
                        <select 
                            className = {`col-7 form-control ${(showRegError && registrationDetails.state === "") && "is-invalid"}`}
                            onChange = {(e) => onChangeRegisterForm(e.target.value,"state")}
                        >
                            <option value  ="">Select State</option>
                            <option value  ="A">A</option>
                            <option value  ="B">B</option>
                        </select>
                    </div>
                    <Button.Ripple  
                    color="primary"
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
                    </Button.Ripple>
                </form>}
                {isRegister && regOtpSent && <>
                  <div className="container">
                    <label><b>Verify Phone Number</b></label>
                    <Input 
                        type="text" 
                        placeholder="Enter OTP" 
                        required
                        value = {otp}
                        onChange = {(e) => setOtp(e.target.value)}
                    />
                    
                    <Button.Ripple 
                    color="primary"
                        id="sign-in-button" 
                        type="submit" 
                        onClick = {() => {verifyOtp()}}
                        disabled = {processing}
                    >
                        {processing && <span className="spinner-border spinner-border-sm" role="status" />}
                        {!processing && <span>Register</span>}
                    </Button.Ripple>
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
            
                </>}
          </ModalBody>
        </Modal>

            <div className="modal login-modal" style = {{display:"none",justifyContent:"center",alignItems:"center"}}>
            <div className="modal-content animate">

                {!isRegister ? !isStaff ? <form className="container">
                    <label><b>Phone Number</b></label>
                    <Input
                        className="mb-2"  
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
                        <Input
                            className="mb-2" 
                            type="text" 
                            placeholder="Enter OTP" 
                            required
                            value = {otp}
                            onChange = {(e) => setOtp(e.target.value)}
                            autoFocus
                        />
                    </>}
                    
                    <div className = "d-flex column">
                        <Button.Ripple 
                        color="primary"
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
                        </Button.Ripple>
                        {!otpSent && <Button.Ripple 
                        color="primary"
                            onClick = {(e) => {
                                e.preventDefault();
                                checkRegister(phoneNumber)
                            }}
                            disabled = {processing || phoneNumber.length < 10}
                            style= {{marginLeft: "2%"}}
                        >
                            Register
                        </Button.Ripple>}
                    </div>
                    
                </form> :
                <form className="container">
                    <label><b>Email Id</b></label>
                    <Input 
                        type="text" 
                        placeholder="Enter Email ID" 
                        value = {phoneNumber} 
                        required 
                        onChange = {(e) => setPhoneNumber(e.target.value)}
                    />

                    <label><b>Password</b></label>
                    <Input 
                        type="password" 
                        placeholder="Enter password" 
                        required
                        value = {otp}
                        onChange = {(e) => setOtp(e.target.value)}
                    />
                    
                    <Button.Ripple 
                    color="primary"
                        type="submit" 
                        onClick = {(e) => {
                            e.preventDefault()
                            firebase.auth().signInWithEmailAndPassword(phoneNumber, otp)
                                .then(result => {
                                    console.log(result)
                                    AuthenticationService.storeUserToken(result.user.phoneNumber);
                                    setLoggedIn(true);
                                    props.history.push("/dashboard/ecommerce")
                                }).catch((error) => {
                                    console.log(error)
                                    console.log("Login failed")
                                });
                        }}
                        disabled = {processing}
                    >
                        Login
                    </Button.Ripple>
                </form> : !regOtpSent ?
                <form className = "container form-group">
                    <div className = "d-flex row mb-4">
                        <label className = "col-4"><b>Name*:</b></label>
                        <Input 
                            className = {`col-7 form-control ${(showRegError && registrationDetails.name === "") && "is-invalid"}`}
                            value  = {registrationDetails.name}
                            onChange = {(e) => onChangeRegisterForm(e.target.value,"name")}
                        />
                    </div>
                    <div className = "d-flex row mb-4">
                        <label className = "col-4"><b>Organisation Name*:</b></label>
                        <Input 
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
                        <Input 
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
                        <Input 
                            className = {`col-7 form-control ${(showRegError && registrationDetails.email === "") && "is-invalid"}`}
                            value  = {registrationDetails.email}
                            onChange = {(e) => onChangeRegisterForm(e.target.value,"email")}
                        />
                    </div>
                    <div className = "d-flex row mb-4">
                        <label className = "col-4"><b>GSTIN:</b></label>
                        <Input 
                            className = {`col-7 form-control`}
                            value  = {registrationDetails.gstin}
                            onChange = {(e) => e.target.value.length <= 15 && onChangeRegisterForm(e.target.value,"gstin")}
                        />
                    </div>

                    <Button.Ripple  
                    color="primary"
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
                    </Button.Ripple>
                </form> : 
                <div className="container">
                    <label><b>Verify Phone Number</b></label>
                    <Input 
                        type="text" 
                        placeholder="Enter OTP" 
                        required
                        value = {otp}
                        onChange = {(e) => setOtp(e.target.value)}
                    />
                    
                    <Button.Ripple 
                    color="primary"
                        id="sign-in-button" 
                        type="submit" 
                        onClick = {() => {verifyOtp()}}
                        disabled = {processing}
                    >
                        {processing && <span className="spinner-border spinner-border-sm" role="status" />}
                        {!processing && <span>Register</span>}
                    </Button.Ripple>
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
      
        </div>
        
    
    </>
    )
}

export default Login;