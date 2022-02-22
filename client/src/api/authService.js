import { useContext } from "react";
import api from "./api";
import TokenService from "./tokenService";
import { UserContext } from "../helpers/UserContext";

// authenticate login call
const login = (data) => {
    return api
        .post("/login", data)
        .then( (res) => {
            // TODO: maybe chack for errors??? -> can improve if statement structure

            // initialise tokens
            if (res.data.accessToken && res.data.refreshToken) {
                TokenService.setLocalAccessToken(res.data.accessToken);
                TokenService.setLocalRefreshToken(res.data.refreshToken);
            }

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

// authenticate register call
const register = (data) => {
    return api
        .post("/register", data)
        .then( (res) => {
            // TODO: maybe handle errors??? -> can improve if statement structure

            // initialise tokens
            if (res.data.accessToken && res.data.refreshToken) {
                TokenService.setLocalAccessToken(res.data.accessToken);
                TokenService.setLocalRefreshToken(res.data.refreshToken);
            }

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

// handle logout call
const logout = () => {
    // reset values in user context
    // const { setUserState } = useContext(UserContext);
    // setUserState({
    //     accessToken: "",
    //     refreshToken: "",
    //     loggedIn: false,
    //     userType: "",   // mentor | mentee
    //     userID: 0,
    //     name: "",
    //     email: "",
    //     department: ""
    // });

    // remove tokens from local storage
    TokenService.removeLocalAccessToken();
    TokenService.removeLocalRefreshToken();
}

// object containing all services related to the authentication 
const AuthServices = {
    login,
    register,
    logout
}

export default AuthServices;