// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        // Vous pouvez ajouter d'autres slices ici plus tard
        // jobs: jobsReducer,
        // applications: applicationsReducer,
        // companies: companiesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST']
            }
        }),
    devTools: import.meta.env.NODE_ENV !== 'production'
});

export default store;