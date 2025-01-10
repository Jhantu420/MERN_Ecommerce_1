// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { Provider } from "react-redux";
// import store from "./store/store"; // Import the store
// import App from "./App"; // Import the main App component
// import "./index.css"; // Global styles

// // Create the root element for the app
// const root = ReactDOM.createRoot(document.getElementById("root"));

// // Render the app inside the root element
// root.render(
//   <Provider store={store}> {/* Provide the Redux store to the app */}
//     <BrowserRouter> {/* Enable React Router for navigation */}
//       <App /> {/* Main App component */}
//     </BrowserRouter>
//   </Provider>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/store";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
