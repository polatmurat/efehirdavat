import { configureStore } from "@reduxjs/toolkit";
import { userService } from "./services/userService";
import authService from "./services/authService";
import categoryService from "./services/categoryService";
import productService from "./services/productService";
import authReducer from "./reducers/authReducer";
import globalReducer from "./reducers/globalReducer";
import homeProducts from "./services/homeProducts";
import exchangeRateService from "./services/exchangeRateService";

const Store = configureStore({
  reducer: {
    [userService.reducerPath]: userService.reducer,
    [authService.reducerPath]: authService.reducer,
    [categoryService.reducerPath]: categoryService.reducer,
    [productService.reducerPath]: productService.reducer,
    [homeProducts.reducerPath]: homeProducts.reducer,
    [exchangeRateService.reducerPath]: exchangeRateService.reducer,
    authReducer,
    globalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userService.middleware,
      authService.middleware,
      categoryService.middleware,
      productService.middleware,
      homeProducts.middleware,
      exchangeRateService.middleware,
    ),
});

export default Store;
