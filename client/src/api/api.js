import axios from "axios";
import TokenService from "./tokenService";

// initialise an instance
const instance = axios.create({
    baseURL: "http://localhost:5000"
});

// runs before making a request call
instance.interceptors.request.use(
    (config) => {
        // get access toke stored in local browser storage
        const token = TokenService.getLocalAccessToekn();
        if (token) {
            // add token to the request header
            config.headers["x-auth-token"] = token;
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
    async (error) => {
        const originalConfig = error.config;

        if (error.response) {
            // if access token is expired
            if (error.response.status === 403 && !originalConfig._retry) {
                // handle infinite calls
                originalConfig._retry = true;
                
                try{
                    // call endpint to get new access token
                    // TODO: add endpoint URL
                    const newRes = await instance.post("", {
                        refreshToken: TokenService.getLocalRefreshToken()
                    });
                    
                    // get new access token
                    const { accessToken } = newRes.data;

                    // update new access token
                    TokenService.setLocalAccessToken(accessToken);

                    return instance(originalConfig);

                }catch(_error){
                    return Promise.reject(_error);
                }
            }
        }
    }
);

export default instance;