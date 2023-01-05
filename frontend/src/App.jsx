import { useState } from "react"
import { useEffect } from "react"
import { createContext } from "react"
import { Outlet } from "react-router-dom"

export const userContext = createContext()
//export const baseURI = process.env.NODE_ENV === 'production' ? "develog-after7203.koyeb.app/" : ""
export const baseURI = ""

const App = () => {
    const [user, setUser] = useState(false)
    useEffect(() => {
        setUser(localStorage.getItem("user"))
    }, [])
    return (
        <userContext.Provider value={{ user, setUser }}>
            <Outlet />
        </userContext.Provider>
    )
}

export default App