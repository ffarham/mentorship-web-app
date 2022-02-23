// returns the user objects 'accessToken' attribute from 'user' in local storage 
const getLocalAccessToken = () => {
    return JSON.parse(localStorage.getItem("dicipulo-accessToken"));
};

// returns the user objects 'refreshToken' attribute from 'user' in local storage
const getLocalRefreshToken = () => {
    return JSON.parse(localStorage.getItem("dicipulo-refreshToken"));
};

// store access token in local storage
const setLocalAccessToken = (accessToken) => {
    localStorage.setItem("dicipulo-accessToken", JSON.stringify(accessToken));
};

// store refresh token in local storage
const setLocalRefreshToken = (refreshToken) => {
    localStorage.setItem("dicipulo-refreshToken", JSON.stringify(refreshToken));
};

// remove access token from local storage
const removeLocalAccessToken = () => {
    localStorage.removeItem("dicipulo-accessToken");
};

// remove refresh token from local storage
const removeLocalRefreshToken = () => {
    localStorage.removeItem("dicipulo-refreshToken");
};

// object containing all services related to tokens
const TokenService = {
    getLocalAccessToken,
    getLocalRefreshToken,
    setLocalAccessToken,
    setLocalRefreshToken,
    removeLocalAccessToken,
    removeLocalRefreshToken
};

export default TokenService;