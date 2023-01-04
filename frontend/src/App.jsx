import { useState } from "react"
import { createContext } from "react"
import { Outlet } from "react-router-dom"

export const userContext = createContext()

const App = () => {
    const [user, setUser] = useState(false)
    return (
        <userContext.Provider value={{ user, setUser }}>
            <Outlet />
        </userContext.Provider>
    )
}

export default App