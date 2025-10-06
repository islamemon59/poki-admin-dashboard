import React from 'react';
import useAuth from '../Hooks/useAuth';

const AdminRoute = () => {
    const {user, loading} = useAuth()

    if(loading) return <h1>Loading</h1>

    if(!user){
        return 
    }
    return (
        <div>
            
        </div>
    );
};

export default AdminRoute;