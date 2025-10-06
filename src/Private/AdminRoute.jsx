import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router';

const AdminRoute = ({children}) => {
    const {user, loading} = useAuth()

    if(loading) return <h1>Loading</h1>

    if(!user){
        return <Navigate to="/forbidden"></Navigate>
    }
    return children
};

export default AdminRoute;