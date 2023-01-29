import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import './index.scss';
import Home from './views/Home/Home.jsx'
import Register from './views/Register/Register';
import App from './App';
import Header from './views/Header/Header';
import UserHome from './views/UserHome/UserHome';
import Write from './views/Write/Write';
import Board from './views/Board/Board';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/:user" element={<UserHome />} />
          <Route path="/:user/:boardURL" element={<Board />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/write" element={<Write />} />
      </Route>
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
  // <React.StrictMode>
  //   <RouterProvider router={router} />
  // </React.StrictMode>
);

