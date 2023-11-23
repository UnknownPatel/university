import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer, Zoom } from "react-toastify";
import axios from "axios";

axios.defaults.headers.common["ngrok-skip-browser-warning"] = true;
// axios.defaults.baseURL = "http://ec2-3-110-181-152.ap-south-1.compute.amazonaws.com/api/v1"
axios.defaults.baseURL = "http://ec2-3-110-181-152.ap-south-1.compute.amazonaws.com/api/v1"
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <App />
    <ToastContainer position="bottom-left" transition={Zoom } />
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
