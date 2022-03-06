import axios from "axios";
import TokenService from "./tokenService";

// initialise an instance
const instance = axios.create({
    baseURL: "http://localhost:5000/"
});

// runs before making a request call
instance.interceptors.request.use(
    (config) => {
        // get access token stored in local browser storage
        const accessToken = TokenService.getLocalAccessToken();
        if (accessToken) {
            // add token to the request header
            config.headers["x-auth-token"] = accessToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }

);

// runs with response data
instance.interceptors.response.use(
    (res) => {
        return res;
    },
    // any status code that falls outside the range 2xx triggers this function
    async (error) => {
        
        const originalConfig = error.config;
        
        if (error.response) {
            // if access token is expired
            if (error.response.status === 403 && !originalConfig._retry) {
                // handle infinite calls
                originalConfig._retry = true;
                
                try{
                    // call endpint to get new access token
                    const newRes = await instance.post("/api/v1/checkrefreshtoken", {
                        refreshToken: TokenService.getLocalRefreshToken()
                    });
                    
                    // get new access token
                    const { newAccessToken, newRefreshToken } = newRes.data;

                    // update new access token
                    TokenService.setLocalAccessToken(newAccessToken);
                    TokenService.setRefreshToken(newRefreshToken);
                    
                    return instance(originalConfig);

                }catch(_error){
                    return Promise.reject(_error);
                }
            }else{
                return error.response;
            }
        }
    }
);

export default instance;