import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services";
import { alertSlice } from "./slices";

const store = configureStore({
  reducer: {
    alert: alertSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
