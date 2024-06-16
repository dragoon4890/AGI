import Navbar from "../src/assets/helpers/Navbar/Navbar";;
import Home from "../src/Pages/Home/Home"
import "./index.css";
import { Routes, Route } from "react-router-dom";
import { createContext, useEffect, useState } from "react";
import StackDetail from "./Pages/StackDetail";



export const UserContext = createContext();

const App = () => {

  return (
    
    <div>
      <Navbar  />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stack/:id" element ={<StackDetail />} /> 
      </Routes>

    </div>
  );
};

export default App;