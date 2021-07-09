import React from 'react'
import AuthenticationService from '../Services/AuthenticationService';
import { Route, Redirect } from 'react-router-dom';

const AuthenticatedRoute = (props) => {
    alert(AuthenticationService.getUserId())
    if(AuthenticationService.getUserId() !== ""){
        return (<Route {...props}/>);
    } else {
        return (<Redirect to = '/login'/>);
    }
}

export default AuthenticatedRoute;