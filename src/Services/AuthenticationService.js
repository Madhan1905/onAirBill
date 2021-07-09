class AuthenticationService {
    storeUserToken(username) {
        sessionStorage.setItem('authenticatedUser',username);
    }

    isAutnenticated() {
        let user = sessionStorage.getItem('authenticatedUser');
        if(user === null) {
            return false;
        } else {
            return true;
        }
    }

    getUserId() {
        let user = sessionStorage.getItem('authenticatedUser');
        if(user === null) {
            return "";
        } else {
            return user;
        }
    }

    removeUserToken() {
        sessionStorage.removeItem('authenticatedUser');
    }
}

export default new AuthenticationService();