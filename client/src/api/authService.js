import { useContext } from "react";
import api from "./api";
import TokenService from "./tokenService";
import { UserContext } from "../helpers/UserContext";

// login call auth handler
const login = (data) => {
    return api
        .post("/testing", data)
        .then( (res) => {
            // initialise returned tokens
            TokenService.setLocalAccessToken(res.data.accessToken);
            TokenService.setLocalRefreshToken(res.data.refreshToken);

            // initialise auth state
            const authState = {
                'userID': res.data.userID,
                'userType': res.data.userType
            };
            localStorage.setItem('authState', JSON.stringify(authState));

            return res;
        });
};

// authenticate register call
const register = (data) => {
    return api
        .post("/register", data)
        .then( (res) => {
            // TODO: maybe handle errors??? -> can improve if statement structure

            // initialise auth state
            TokenService.setLocalAccessToken(res.data.accessToken);
            TokenService.setLocalRefreshToken(res.data.refreshToken);

            // initialise user context
            if (res.data.user) {
                const { setUserState } = useContext(UserContext);
                setUserState({
                    loggedIn: true,
                    userType: res.data.userType,
                    userID: res.data.userID,
                    name: res.data.name,
                    email: res.data.email,
                    department: res.data.department
                });
            }
            return res.data;
        });
};

// logout call auth handler
const logout = () => {
    return api
        .post("/logout")
        .then( (res) => {
                // remove tokens from local storage
                TokenService.removeLocalAccessToken();
                TokenService.removeLocalRefreshToken();
            
                // remove auth state
                localStorage.removeItem('authState');

                return res;
        });
}

// object containing all services related to the authentication 
const AuthServices = {
    login,
    register,
    logout
}

export default AuthServices;