import React from "react";
import DashBoard from "./pages/DashBoard";
import LogInPage from "./pages/LogInPage";
import { Route,Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PrivateRoutes from "./PrivateRoutes";
import SignInPage from "./pages/SignInPage";
import StockChart from "./pages/StockChart";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoutes/>}>
          <Route path="/dashboard" element={<DashBoard/>} exact/>
        </Route>
        <Route path="/" element={<LogInPage/>}/>
        <Route path="signin" element={<SignInPage/>}/>
        <Route path="/stock-chart" element={<StockChart/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
      <ToastContainer/>
    </>
  )
}

export default App;
