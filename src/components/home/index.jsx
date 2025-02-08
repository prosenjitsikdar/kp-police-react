import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { currentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // If currentUser is null or undefined, navigate to login page.
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    if (!currentUser) {
        return <div>Loading...</div>;  // Show a loading state while user is being fetched
    }

    return (
        <div>
            <div className='text-2xl font-bold pt-14 text-center mb-4'>
                Hello, {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.
            </div>


        </div>
    );
};

export default Home;
