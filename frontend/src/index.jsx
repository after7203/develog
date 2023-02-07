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
import Setting from './views/Setting/Setting';
import UserHome from './views/UserHome/UserHome';
import Write from './views/Write/Write';
import Board from './views/Board/Board';
import TagSelect from './views/TagSelect/TagSelect';
import Series from './views/Series/Series';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/:user_id" element={<UserHome />} />
          <Route path="/tag/:tag" element={<TagSelect />} />
          <Route path="/:writer/:boardURL" element={<Board />} />
          <Route path="/:user/series/:series_url" element={<Series />} />
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

