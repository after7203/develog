import { useState } from "react"
import { useEffect } from "react"
import { createContext } from "react"
import { Outlet } from "react-router-dom"

export const userContext = createContext()
export let baseURI

const App = () => {
    const [user, setUser] = useState(false)
    useEffect(() => {
        console.log("Hello")
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