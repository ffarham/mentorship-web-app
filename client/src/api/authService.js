import api from "./api";
import TokenService from "./tokenService";

// login call auth handler
const login = (data) => {
    return api
        .post("/api/v1/login", data)
        .then( 
        (res) => {
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
        },
        (error) => {
            // user not find 500 status
            // email-password error
            // mentor/mentee error
            console.log(error);
        }
        );
};

// authenticate register call
const register = (data) => {
    return api
        .post("/api/v1/register", data)
        .then( 
            (res) => {

                // initialise tokens
                TokenService.setLocalAccessToken(res.data.accessToken);
                TokenService.setLocalRefreshToken(res.data.refreshToken);
                
                // initialise auth state
                const authState = {
                    'userID': res.data.userID,
                    'userType': res.data.userType,
                };
                localStorage.setItem('authState', JSON.stringify(authState));
                
                return res;
            },
            (error) => {
                return error;
            }
        );
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