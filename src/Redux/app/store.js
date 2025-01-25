import { configureStore } from '@reduxjs/toolkit';
import RegisterReducer from '../Features/auth/RegisterSlice';
import loginReducer from '../Features/auth/loginSlice';
const store = configureStore({
    reducer: {
        register: RegisterReducer,
        login : loginReducer,
    },
}); 
export default store;