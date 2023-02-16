import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { Outlet } from "react-router-dom";
import "./App.scss";
import Spinner from "./components/Spinner/Spinner";

export const userContext = createContext();
export const spinnerContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const storage = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user")
    );
    if (storage) {
      setUser(storage);
      //   fetchUser(storage.id, storage.token);
    }
  }, []);
  //   const fetchUser = async (_id, token) => {
  //     axios.defaults.headers.common["Authorization"] = token;
  //     try {
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_SERVER_URI}/api/users?id=${id}`
  //       );
  //       res.data.user.token = token;
  //       setUser(res.data.user);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  return (
    <userContext.Provider value={{ user, setUser }}>
      <spinnerContext.Provider value={{ setIsLoading }}>
        {isLoading && <Spinner />}
        <Outlet />
      </spinnerContext.Provider>
    </userContext.Provider>
  );
};

export default App;
