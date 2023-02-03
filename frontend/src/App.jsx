import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { createContext } from "react"
import { Outlet } from "react-router-dom"
import "./App.scss"

export const userContext = createContext()

const App = () => {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"))
        fetchUser(storage._id, storage.token)
    }, [])
    const fetchUser = async (_id, token) => {
        axios.defaults.headers.common['Authorization'] = token;
        try {
            const res = await axios.get(`${process.env.REACT_APP_SERVER_URI}/api/users/${_id}`)
            res.data.user.token = token;
            setUser(res.data.user)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <userContext.Provider value={{ user, setUser }}>
            <Outlet />
        </userContext.Provider>
    )
}

export default App