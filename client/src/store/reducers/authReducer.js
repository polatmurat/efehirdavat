import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode"

const customerToken = localStorage.getItem('userToken')
const adminToken = localStorage.getItem('admin-token')

function verifyToken(keyName) {
    const storage = localStorage.getItem(keyName);
    if(storage) {
       const decodeToken = jwtDecode(storage);
       const expiresIn = new Date(decodeToken.exp * 1000);
       if(new Date() > expiresIn) {
           localStorage.removeItem(keyName);
           return null;
       } else {
           return storage;
       }
    } else {
        return null;
    }
}

const authReducer = createSlice({
    name: 'authReducer',
    initialState: {
        adminToken: verifyToken('admin-token'),
        userToken: verifyToken('userToken'),
        user: adminToken ? jwtDecode(adminToken) : (customerToken ? jwtDecode(customerToken) : null),
    },
    reducers: {
        setAdminToken: (state, action) => {
          state.adminToken = action.payload;
          if (action.payload) {
            state.user = jwtDecode(action.payload);
          }
        },
        setUserToken: (state, action) => {
            state.userToken = action.payload;
            if (action.payload) {
              state.user = jwtDecode(action.payload);
            }
        },
        logout: (state, {payload}) => {
          localStorage.removeItem(payload)
          if(payload === 'admin-token') {
            state.adminToken = null;
            state.user = null;
          } else if(payload === 'userToken') {
            state.userToken = null;
            state.user = null;
          }
        }
    }
})

export const {setAdminToken, setUserToken, logout} = authReducer.actions;
export default authReducer.reducer;