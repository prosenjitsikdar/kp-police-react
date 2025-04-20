import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doSignOut } from '../../firebase/auth.js';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const LoggedInHeader = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Get the current user from Firebase Authentication
        const auth = getAuth();
        const currentUser = auth.currentUser;

        // If currentUser is null or undefined, navigate to login page.
        if (!currentUser) {
            navigate('/login');
        } else {
            // Fetch user data from Firestore when currentUser exists
            const fetchUserData = async () => {
                const db = getFirestore();
                const userDocRef = doc(db, 'user_data', currentUser.uid); // Assuming 'user_data' is your collection
                try {
                    const docSnap = await getDoc(userDocRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data()); // Set user data in state
                    } else {
                        console.log('No such document!');
                    }
                } catch (error) {
                    console.error('Error fetching user data: ', error);
                } finally {
                    setLoading(false); // Set loading to false after data is fetched
                }
            };

            fetchUserData();
        }
    }, [navigate]); // Run effect when `navigate` changes (usually does not change)

    return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo or Title */}
                <div className="text-2xl font-bold">
                    <Link to="/" className="hover:text-gray-200">KPD Reception</Link>
                </div>

                {/* Navigation Links */}
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link to="/home" className="hover:text-gray-200">Home</Link>
                        </li>
                        {/* Conditionally show this link if the user's role is "super" */}
                        {userData?.role === 'super' && (
                            <>
                                <li>
                                    <Link to="/add-category" className="hover:text-gray-200">Add Category</Link>
                                </li>
                                <li>
                                    <Link to="/sub-category" className="hover:text-gray-200">Add Sub Category</Link>
                                </li>
                                <li>
                                    <Link to="/police-station" className="hover:text-gray-200">Add Police Station</Link>
                                </li>
                                <li>
                                    <Link to="/user-data" className="hover:text-gray-200">User Data</Link>
                                </li>

                                <li>
                                    <Link to="/csv-download" className="hover:text-gray-200">csv download</Link>
                                </li>
                            </>
                        )}

                        <li>
                            <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-white-600 underline'>Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default LoggedInHeader;
