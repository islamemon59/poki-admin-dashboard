import React from 'react';
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router';
import Loader from '../Shared/Loader/Loader';

const AdminRoute = ({children}) => {
    const {user, loading} = useAuth()

    if(loading) return <Loader/>

    if(!user){
        return <Navigate to="/login"></Navigate>
    }
    return children
};

export default AdminRoute;