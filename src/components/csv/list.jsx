import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Adjust the import if necessary
import { useAuth } from '../../contexts/authContext';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const CsvDownload = () => {
    const navigate = useNavigate(); // Hook for navigation
    const { currentUser  } = useAuth();
    const [policeStations, setPoliceStations] = useState([]); // State to hold police station data
    const [loading, setLoading] = useState(true); // State to manage loading state

    useEffect(() => {
        // Redirect to login if no currentUser  is found
        if (!currentUser ) {
            navigate('/login'); // Redirect to login page
        } else {
            fetchPoliceStations(); // Fetch police stations if user is authenticated
        }
    }, [currentUser , navigate]);

    const fetchPoliceStations = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'police_station'));
            const stations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPoliceStations(stations); // Set the fetched data to state
        } catch (error) {
            console.error("Error fetching police stations: ", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    return (
        <div className="w-7xl mt-6 mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">CSV Download</h2>

            <div className="mb-4 flex justify-between items-center">
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="filterPoliceStation">
                        Filter by Police Station
                    </label>
                    {/* You can add a dropdown or input here to filter the police stations */}
                </div>
            </div>

            {loading ? (
                <p>Loading police stations...</p>
            ) : (
                <ul>
                    {policeStations.map(station => (
                        <li key={station.id} className="border-b py-2">
                            {station.name} {/* Adjust this to match your data structure */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CsvDownload;