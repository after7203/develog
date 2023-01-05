import { useState } from "react"
import { useEffect } from "react"
import { createContext } from "react"
import { Outlet } from "react-router-dom"

export const userContext = createContext()

const App = () => {
    const [user, setUser] = useState(false)
    useEffect(() => {
        setUser(localStorage.getItem("user"))
        if(process.env.NODE_ENV === 'production') console.log(process.env.NODE_ENV)
    }, [])
    return (
        <userContext.Provider value={{ user, setUser }}>
            <Outlet />
        </userContext.Provider>
    )
}

export default App