import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import PoliceStationList from './list.jsx';

const AddPoliceStationForm = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [policeStations, setPoliceStations] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // Fetch police stations from Firestore
    useEffect(() => {
        const fetchPoliceStations = async () => {
            try {
                const q = query(collection(db, 'police_station'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);

                const policeStationList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPoliceStations(policeStationList);
            } catch (error) {
                console.error('Error fetching police stations:', error);
            }
        };

        fetchPoliceStations();
    }, []); // Fetch once on mount

    // Generate a 10-character unique notification ID
    const generateNotificationId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let notificationId = '';
        for (let i = 0; i < 10; i++) {
            notificationId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return notificationId;
    };

    // Handle adding a new police station
    const handleSubmit = async (e) => {
        e.preventDefault();

        const notificationId = generateNotificationId();
        const policeStationData = {
            name,
            notification_id: notificationId,
            createdAt: new Date(),
        };

        try {
            const docRef = await addDoc(collection(db, 'police_station'), policeStationData);
            const newPoliceStation = { id: docRef.id, ...policeStationData };

            setPoliceStations((prevPoliceStations) => [newPoliceStation, ...prevPoliceStations]);

            console.log('Police Station Added:', newPoliceStation);
            setName('');
        } catch (error) {
            console.error('Error adding police station: ', error);
        }
    };

    // Handle deleting a police station
    const handleDelete = async (id) => {
        try {
            const policeStationRef = doc(db, 'police_station', id);
            await deleteDoc(policeStationRef);

            setPoliceStations((prevPoliceStations) =>
                prevPoliceStations.filter((station) => station.id !== id)
            );

            console.log('Police Station Deleted:', id);
        } catch (error) {
            console.error('Error deleting police station: ', error);
        }
    };

    // Handle updating a police station
    const handleEdit = async (id, updatedName) => {
        try {
            const policeStationRef = doc(db, 'police_station', id);
            await updateDoc(policeStationRef, {
                name: updatedName
            });

            setPoliceStations((prevPoliceStations) =>
                prevPoliceStations.map((station) =>
                    station.id === id ? { ...station, name: updatedName } : station
                )
            );

            console.log('Police Station Updated:', id);
        } catch (error) {
            console.error('Error updating police station: ', error);
        }
    };

    return (
        <>
            <div className="w-7xl mt-6 mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Add New Police Station</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                            Police Station Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                        >
                            Add Police Station
                        </button>
                    </div>
                </form>
            </div>

            <PoliceStationList
                policeStations={policeStations}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
            />
        </>
    );
};

export default AddPoliceStationForm;
