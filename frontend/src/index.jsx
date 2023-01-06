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
import Header from './views/Header/Header';
import UserHome from './views/UserHome/UserHome';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />}/>
          <Route path="/:user" element={<UserHome/>}/>
        </Route>
        <Route path="/register" element={<Register />} />
      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

