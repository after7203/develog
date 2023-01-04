import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import Home from './views/Home/Home.jsx'
import Register from './views/Register/Register';
import App from './App';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App/>}>
      <Route path="/" element={<Home />}/>
      <Route path="/register" element={<Register />}/>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

