import React, { useEffect, useState } from 'react';
import { setPaidUsers } from '../Services/FirebaseSerice';
const Razorpay = require("razorpay");

const Payments = () => {

    const [trialSelected,setTrialSelected] = useState(true);

    const loadScript= (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    const openRazorPay = async() => {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        const options = {
            key: 'rzp_test_xxaQHCl5jWTXJQ',
            amount: '500000', //  = INR 1
            name: 'On Air Bill',
            description: 'Payment',
            image: 'https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png',
            handler: function() {
                setPaidUsers(sessionStorage.getItem("phoneNumber"),"Paid").then(() => {
                    window.location.replace("/Dashboard")
                })
            },
            prefill: {
                name: 'Gaurav',
                contact: '9999999999',
                email: 'demo@demo.com'
            },
            notes: {
                address: 'some address'
            },
            theme: {
                color: 'blue',
                hide_topbar: false
            }
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    return(
        <div id = "payForm" className = "d-flex align-items-center justify-content-center" style = {{height:"100%"}}>
            <div className="modal" style = {{display: "block"}}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Payment</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {sessionStorage.getItem("validityExpired") && <div>
                            <input type = "radio" checked = {trialSelected} onClick = {() => setTrialSelected(true)}/>7 day Free Trial
                        </div>}
                        <div>
                            <input type = "radio" checked = {!trialSelected} onClick = {() => setTrialSelected(false)}/>5000/year Premium Plan
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick = {() => {
                            if(trialSelected){
                                setPaidUsers(sessionStorage.getItem("phoneNumber"),"Trial").then(() => {
                                    window.location.replace("/Dashboard")
                                })
                            } else {
                                openRazorPay()
                            }
                        }}>
                            {trialSelected ? 'Continue' : 'Pay'}
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payments;