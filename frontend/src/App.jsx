import { useState } from "react"
import { useEffect } from "react"
import { createContext } from "react"
import { Outlet } from "react-router-dom"
import "./App.scss"

export const userContext = createContext()

const App = () => {
    const [user, setUser] = useState(false)
    useEffect(() => {
        // setUser(localStorage.getItem("user"))
    }, [])
    return (
        <userContext.Provider value={{ user, setUser }}>
            <Outlet />
        </userContext.Provider>
    )
}

export default App