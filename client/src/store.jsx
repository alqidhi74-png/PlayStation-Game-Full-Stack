import { configureStore } from "@reduxjs/toolkit";
import UserReducer from './features/UserSlice';
import PlayReducer from './features/PlaySlice';
import ThemeReducer from './features/ThemeSlice';

export const store=configureStore({
    reducer:{
        user:UserReducer,
        playstation:PlayReducer,
        theme:ThemeReducer
    }
});
export default store;