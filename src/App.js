import React from "react";
import DashBoard from "./pages/DashBoard";
import LogInPage from "./pages/LogInPage";
import { Route,Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PrivateRoutes from "./PrivateRoutes";
import SignInPage from "./pages/SignInPage";
import StockChart from "./pages/ProductsStockChart";
import NotFound from "./pages/NotFound";
import ProductsCountPriceChart from "./pages/ProductsCountPriceChart";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes/>}>
          <Route path="/dashboard" element={<DashBoard/>} exact/>
          <Route path="/products-stock-chart" element={<StockChart/>}/>
          <Route path="/products-count-price-chart" element={<ProductsCountPriceChart/>}/>
        </Route>
        <Route path="/" element={<LogInPage/>}/>
        <Route path="signin" element={<SignInPage/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <ToastContainer/>
    </>
  )
}

export default App;
