import { useState } from "react"
import { useEffect } from "react"
import { createContext } from "react"
import { Outlet } from "react-router-dom"
import Header from "./views/Header/Header"
import "./App.scss"

export const userContext = createContext()
export let baseURI

const App = () => {
    const [user, setUser] = useState(false)
    useEffect(() => {
        setUser(localStorage.getItem("user"))
        if (process.env.NODE_ENV === 'production') {
            baseURI = "https://develog-after7203.koyeb.app"
        }
        else {
            baseURI = "http://localhost:3001"
        }
    }, [])
    return (
        <userContext.Provider value={{ user, setUser }}>
            <Outlet />
        </userContext.Provider>
    )
}

export default App