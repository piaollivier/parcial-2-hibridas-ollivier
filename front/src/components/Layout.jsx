import React from 'react'
import { Outlet } from 'react-router'
import Nav from './Nav.jsx'


const Layout = () => {
    return (
        <>
            <Nav />
            <Outlet />
            {/* <Footer /> */}
        </>
    )
}

export default Layout