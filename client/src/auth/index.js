import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    INVALID_LOGIN: "INVALID_LOGIN",
    CLEAR_MODALS: "CLEAR_MODALS",
    INVALID_REGISTER: "INVALID_REGISTER"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        invalidLogin: false,
        error: null,
        invalidRegister: false
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    invalidLogin: false,
                    error:null,
                    invalidRegister: false
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    invalidLogin: false,
                    error:null,
                    invalidRegister: false
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    invalidLogin: false,
                    error:null,
                    invalidRegister: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    invalidLogin: false,
                    error:null,
                    invalidRegister: false
                })
            }
            case AuthActionType.INVALID_LOGIN: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    invalidLogin: true,
                    error:payload,
                    invalidRegister: false
                })
            }
            case AuthActionType.CLEAR_MODALS: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    invalidLogin: false,
                    error:null,
                    invalidRegister: false
                })
            }
            case AuthActionType.INVALID_REGISTER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    invalidLogin: false,
                    error:payload,
                    invalidRegister: true
                });
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(firstName, lastName, email, password, passwordVerify) {
        try {
            const response = await api.registerUser(firstName, lastName, email, password, passwordVerify);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        } catch (err) {
            console.log(err);
            authReducer({
                type: AuthActionType.INVALID_REGISTER,
                payload:err
            });
        }
    }

    auth.loginUser = async function(email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        } catch(err) {
            console.log(err);
            authReducer({
                type: AuthActionType.INVALID_LOGIN,
                payload: err
            });
        }
    }
    auth.isLoginModalOpen = () => {
        return auth.invalidLogin;
    }
    auth.isRegisterModalOpen = () => {
        return auth.invalidRegister;
    }
    auth.hideModals = () => {
        authReducer({
            type: AuthActionType.CLEAR_MODALS,
            payload: {}
        });    
    }
    // USER LOGOUT - ONE OPTION OF LOGOUT IN THE MENU. RETURNS TO SPLASH SCREEN AFTER CLICKING LOGOUT.
    
    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };