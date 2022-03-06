import api from "./api";
import TokenService from "./tokenService";

// login call auth handler
const login = (data) => {
    return api
        .post("/api/v1/login", data)
        .then( (response) => {

            // if successful
            if(response.status === 200){
                // initialise returned tokens
                TokenService.setLocalAccessToken(response.data.accessToken);
                TokenService.setLocalRefreshToken(response.data.refreshToken);
    
                // initialise auth state
                const authState = {
                    'userID': response.data.userID,
                    'userType': response.data.userType
                };
                localStorage.setItem('authState', JSON.stringify(authState));
            }

            return response;
        });
};

// authenticate register call
const register = (data) => {
    return api
        .post("/api/v1/register", data)
        .then( (res) => {   
            return res;
        });
};

// logout call auth handler
const logout = async (data) => {
    return await api
        .post("/api/v1/logout", data)
        .then( 
            (res) => {
                // remove tokens from local storage
                TokenService.removeLocalAccessToken();
                TokenService.removeLocalRefreshToken();
            
                // remove auth state
                localStorage.removeItem('authState');
                return res;
            },
        );
}

// object containing all services related to the authentication 
const AuthServices = {
    login,
    register,
    logout
}

export default AuthServices;