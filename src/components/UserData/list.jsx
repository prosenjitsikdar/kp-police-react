import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Adjust the import if necessary
import { useAuth } from '../../contexts/authContext';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const UserDataList = () => {
    const [userData, setUserData] = useState([]); // All users data
    const [editUser, setEditUser] = useState(null); // For storing user data to be edited
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedFullName, setUpdatedFullName] = useState(''); // New state for full name
    const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState(''); // New state for phone number
    const [updatedAddress, setUpdatedAddress] = useState(''); // New state for address
    const [updatedRole, setUpdatedRole] = useState('user');
    const [policeStations, setPoliceStations] = useState([]); // For storing police stations
    const [updatedPoliceStation, setUpdatedPoliceStation] = useState(''); // For storing selected police station
    const [updatedNotificationId, setUpdatedNotificationId] = useState(''); // For storing notification_id based on police station selection
    const [selectedPoliceStation, setSelectedPoliceStation] = useState(''); // For filtering users by selected police station
    const navigate = useNavigate(); // Hook for navigation

    const { currentUser } = useAuth();

    useEffect(() => {
        // Redirect to login if no currentUser is found
        if (!currentUser) {
            navigate('/login'); // Redirect to login page
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        // Fetch user data from Firestore
        const fetchUserData = async () => {
            try {
                const userRef = collection(db, 'user_data');
                const querySnapshot = await getDocs(userRef);
                const data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        // Fetch police stations data from Firestore
        const fetchPoliceStations = async () => {
            try {
                const policeRef = collection(db, 'police_station');
                const querySnapshot = await getDocs(policeRef);
                const policeData = querySnapshot.docs.map((doc) => ({
                    id: doc.id, // Use the document ID as the 'id'
                    ...doc.data(),
                }));
                setPoliceStations(policeData);
            } catch (error) {
                console.error('Error fetching police stations:', error);
            }
        };

        fetchPoliceStations();
    }, []);

    // Handle edit button click
    const handleEditClick = (user) => {
        setEditUser(user); // Set the user to edit
        setUpdatedEmail(user.email);
        setUpdatedFullName(user.full_name || ''); // Set full name if available
        setUpdatedPhoneNumber(user.phone_number || ''); // Set phone number if available
        setUpdatedAddress(user.address || ''); // Set address if available
        setUpdatedRole(user.role);
        setUpdatedPoliceStation(user.police_station || ''); // Set police station if available

        // Get the corresponding notification_id for the police station
        const selectedPoliceStation = policeStations.find(station => station.id === user.police_station);
        setUpdatedNotificationId(selectedPoliceStation ? selectedPoliceStation.notification_id : ''); // Automatically set notification_id
    };

    // Handle update submission
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            // Update the user data in Firestore
            const userDocRef = doc(db, 'user_data', editUser.id);
            await updateDoc(userDocRef, {
                email: updatedEmail,
                full_name: updatedFullName, // Include full name
                phone_number: updatedPhoneNumber, // Include phone number
                address: updatedAddress, // Include address
                notification_id: updatedNotificationId, // Use notification_id from police station selection
                role: updatedRole,
                police_station: updatedPoliceStation, // Update police station
            });

            // Update the state with the modified user
            setUserData((prevData) =>
                prevData.map((user) =>
                    user.id === editUser.id
                        ? { ...user, email: updatedEmail, full_name: updatedFullName, phone_number: updatedPhoneNumber, address: updatedAddress, notification_id: updatedNotificationId, role: updatedRole, police_station: updatedPoliceStation }
                        : user
                )
            );

            // Reset the edit state
            setEditUser(null);
            setUpdatedEmail('');
            setUpdatedFullName('');
            setUpdatedPhoneNumber('');
            setUpdatedAddress('');
            setUpdatedNotificationId('');
            setUpdatedRole('user');
            setUpdatedPoliceStation('');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    // Filter users by selected police station (using doc ID for matching)
    const filteredUsers = selectedPoliceStation
        ? userData.filter((user) => user.police_station === selectedPoliceStation)
        : userData;

    const getPoliceStationName = (policeStationId) => {
        // Match the police station doc ID with the ID from policeStations collection
        const policeStation = policeStations.find((station) => station.id === policeStationId);
        return policeStation ? policeStation.name : 'N/A';
    };

    return (
        <div className="w-7xl mt-6 mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">User Data</h2>

            {/* Filter by Police Station */}
            <div className="mb-4 flex justify-between items-center">
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="filterPoliceStation">
                        Filter by Police Station
                    </label>
                    <select
                        id="filterPoliceStation"
                        value={selectedPoliceStation}
                        onChange={(e) => setSelectedPoliceStation(e.target.value)}
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Police Stations</option>
                        {policeStations.map((station) => (
                            <option key={station.id} value={station.id}>
                                {station.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="text-center text-lg text-gray-600">No user data available.</div>
            ) : (
                <table className="min-w-full table-auto">
                    <thead>
                    <tr>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Full Name</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Phone Number</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Address</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Police Station</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-t border-gray-200">
                            <td className="px-6 py-2 text-sm text-gray-700">{user.email}</td>
                            <td className="px-6 py-2 text-sm text-gray-700">{user.full_name}</td>
                            <td className="px-6 py-2 text-sm text-gray-700">{user.phone_number}</td>
                            <td className="px-6 py-2 text-sm text-gray-700">{user.address}</td>
                            <td className="px-6 py-2 text-sm text-gray-700">{user.role}</td>
                            <td className="px-6 py-2 text-sm text-gray-700">{getPoliceStationName(user.police_station)}</td>
                            <td className="px-6 py-2 text-sm text-gray-700">
                                <button
                                    onClick={() => handleEditClick(user)}
                                    className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Edit Form for updating user data */}
            {editUser && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="updatedEmail">
                                Email
                            </label>
                            <input
                                type="email"
                                id="updatedEmail"
                                value={updatedEmail}
                                onChange={(e) => setUpdatedEmail(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="updatedFullName">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="updatedFullName"
                                value={updatedFullName}
                                onChange={(e) => setUpdatedFullName(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="updatedPhoneNumber">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                id="updatedPhoneNumber"
                                value={updatedPhoneNumber}
                                onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="updatedAddress">
                                Address
                            </label>
                            <input
                                type="text"
                                id="updatedAddress"
                                value={updatedAddress}
                                onChange={(e) => setUpdatedAddress(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="updatedRole">
                                Role
                            </label>
                            <select
                                id="updatedRole"
                                value={updatedRole}
                                onChange={(e) => setUpdatedRole(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option>Select Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="superior">superior</option>
                            </select>
                        </div>

                        {/* Police Station Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="updatedPoliceStation">
                                Police Station
                            </label>
                            <select
                                id="updatedPoliceStation"
                                value={updatedPoliceStation}
                                onChange={(e) => {
                                    const selectedStation = policeStations.find(station => station.id === e.target.value);
                                    setUpdatedPoliceStation(e.target.value);
                                    setUpdatedNotificationId(selectedStation ? selectedStation.notification_id : ''); // Set notification_id based on police station
                                }}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a Police Station</option>
                                {policeStations.map((station) => (
                                    <option key={station.id} value={station.id}>
                                        {station.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                            >
                                Update User
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserDataList;
