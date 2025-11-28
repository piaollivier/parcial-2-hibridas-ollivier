import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ component }) => {
    const session = JSON.parse(localStorage.getItem('session'))
    if (session) {
        return component
    } else {
        return <Navigate to="/login" /> 
    }
}

export default ProtectedRoute
