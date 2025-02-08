import React from 'react';
import { Link } from 'react-router-dom';
import { doSignOut } from '../../firebase/auth.js';

const LogedInHeader = () => {
    return (
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo or Title */}
                <div className="text-2xl font-bold">
                    <Link to="/" className="hover:text-gray-200">My App</Link>
                </div>

                {/* Navigation Links */}
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link to="/home" className="hover:text-gray-200">Home</Link>
                        </li>
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
                            <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-white-600 underline'>Logout</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default LogedInHeader;
