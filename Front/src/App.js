import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.scss";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Category from "./components/Category/Category";
import SingleProduct from "./components/SingleProduct/SingleProduct";
import Newsletter from "./components/Footer/Newsletter/Newsletter";
import AppContext from "./utils/context";
import { Login } from "./components/Auth/Login";
import { Register } from "./components/Auth/Register";
import { UserLayout } from "./UserLayout";
import UserList from "./components/admin/userlist/UserList";
import PostEvent from "./components/admin/postevent/PostEvent";
import PostCategory from "./components/admin/postcategtory/PostCategory";
import AdminOrders from "./components/admin/orders/AdminOrders";
import AdminProfile from "./components/admin/profile/AdminProfile";
import Admin from "./components/admin/Admin";
import About from "./components/About";
import Profile from "./components/Profile/Profile";
import OrderHistory from "./components/OrderHistory/OrderHistory";
import ProtectedRoute from "./ProtectedRoute";
import AdminLogin from "./components/admin/AdminLogin";
import AllProducts from "./components/AllProducts/AllProducts";
import ManageCategories from "./components/admin/manage/ManageCategories";
import ManageProducts from "./components/admin/manage/ManageProducts";
import { ToastContainer } from "react-toastify";
import AIChatbot from "./components/AIChatbot/AIChatbot";


import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <AppContext>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route path="" element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="category/:id" element={<Category />} />
            <Route path="product/:id" element={<SingleProduct />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="orders" element={<OrderHistory />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          >
            <Route path="" element={<UserList />} />
            <Route path="userlist" element={<UserList />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="postcategory" element={<PostCategory />} />
            <Route path="postproduct" element={<PostEvent />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="manage-categories" element={<ManageCategories />} />
            <Route path="manage-products" element={<ManageProducts />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        <AIChatbot />
      </AppContext>
    </BrowserRouter>
  );
}

export default App;
