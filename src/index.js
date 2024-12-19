import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./providers/UserProvider";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { ThirdwebProvider } from "thirdweb/react";

alert = toast;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThirdwebProvider>
      <UserProvider>
        <App />
        <ToastContainer />;
      </UserProvider>
    </ThirdwebProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
