import { use, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useLogout } from "../context/SessionContext"

const Logout = () => {
    const logout = useLogout()
    useEffect(() => {
        logout()
    }, [] )
    return <Navigate to="/login" />

}

export default Logout