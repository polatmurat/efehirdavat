import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../screens/auth/AdminLogin";
import Categories from "../screens/dashboard/Categories";
import CreateCategory from "../screens/dashboard/CreateCategory";
import Products from "../screens/dashboard/Products";
import UpdateCategory from "../screens/dashboard/UpdateCategory";
import CreateProduct from "../screens/dashboard/CreateProduct";
import Private from "./Private.js";
import Public from "./Public";
import EditProduct from "../screens/dashboard/EditProduct";
import Home from "../screens/home/Home";
import Login from "../screens/home/auth/Login";
import Dashboard from "../screens/users/Dashboard";
import UserRoute from "./UserRoute";
import UserAuthRoute from "./UserAuthRoute";
import CatProducts from "../screens/home/CatProducts";
import Product from "../screens/home/Product";
import SearchProducts from "../screens/home/SearchProducts";
import Users from '../screens/dashboard/Users'
import CreateUser from '../screens/dashboard/CreateUser'
import EditUser from '../screens/dashboard/EditUser'
import AllProducts from "../screens/home/AllProducts.js";
const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/page/1" />} />
        <Route path="/page/:page" element={<Home />} />
        <Route path="/all-products/:page" element={<AllProducts />} />
        <Route path="*" element={<Navigate to="/page/1" />} />
        <Route path="cat-products/:name" element={<CatProducts />} />
        <Route path="cat-products/:name/:page" element={<CatProducts />} />
        <Route
          path="search-products/:keyword/:page"
          element={<SearchProducts />}
        />
        <Route path="product/:name" element={<Product />} />
        <Route element={<UserAuthRoute />}>
          <Route path="login" element={<Login />} />
        </Route>
        <Route element={<UserRoute />}>
          <Route path="user" element={<Dashboard />} />
        </Route>
        <Route path="auth">
          <Route
            path="admin-login"
            element={
              <Public>
                <AdminLogin />
              </Public>
            }
          />
        </Route>
        <Route path="dashboard">
          <Route
            path="products"
            element={
              <Private>
                <Products />
              </Private>
            }
          />
          <Route
            path="products/:page"
            element={
              <Private>
                <Products />
              </Private>
            }
          />
          <Route
            path="edit-product/:id"
            element={
              <Private>
                <EditProduct />
              </Private>
            }
          />
          <Route
            path="categories"
            element={
              <Private>
                <Categories />
              </Private>
            }
          />
          <Route
            path="categories/:page"
            element={
              <Private>
                <Categories />
              </Private>
            }
          />
          <Route
            path="create-category"
            element={
              <Private>
                <CreateCategory />
              </Private>
            }
          />
          <Route
            path="update-category/:id"
            element={
              <Private>
                <UpdateCategory />
              </Private>
            }
          />
          <Route
            path="create-product"
            element={
              <Private>
                <CreateProduct />
              </Private>
            }
          />
          <Route path="users" element={<Private><Users /></Private>} />
          <Route path="users/:page" element={<Private><Users /></Private>} />
          <Route path="create-user" element={<Private><CreateUser /></Private>} />
          <Route path="edit-user/:id" element={<Private><EditUser /></Private>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Routing;
