import React from "react";
import DashBoard from "./pages/DashBoard";
import EntryPage from "./pages/EntryPage";
import { Route,Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PrivateRoutes from "./PrivateRoutes";

function App() {
  return (
    <>
      <Routes>
      <Route element={<PrivateRoutes/>}>
        <Route path="/dashboard" element={<DashBoard/>} exact/>
      </Route>
        <Route path="/" element={<EntryPage/>}/>
      </Routes>
      <ToastContainer/>
    </>
  )
}

export default App;
