import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/authContext';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const CsvDownload = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [policeStations, setPoliceStations] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStation, setSelectedStation] = useState('');

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [currentUser, navigate]);

    const fetchData = async () => {
        try {
            const policeSnapshot = await getDocs(collection(db, 'police_station'));
            const policeList = policeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPoliceStations(policeList);

            const complaintsSnapshot = await getDocs(collection(db, 'complaints'));
            const complaintsList = complaintsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setComplaints(complaintsList);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };


    const downloadCSV = () => {
        const filteredComplaints = complaints.filter(
            (complaint) => complaint.police_station === selectedStation
        );
    
        if (filteredComplaints.length === 0) {
            alert('No complaints to download.');
            return;
        }
    
        const headers = [
            'Name',
            'Phone',
            'Address',
            'Complain Type',
            'Description',
            'Police Station',
            'Receptionist Name',
            'Receptionist Mobile',
            'Complain Register Time'
        ];
    
        const rows = filteredComplaints.map(complaint => [
            complaint.name,
            complaint.phone,
            complaint.address,
            complaint.complainType,
            complaint.description,
            policeStations.find(station => station.id === complaint.police_station)?.name || complaint.police_station,
            complaint.receptionistName,
            complaint.receptionistMobile,
            complaint.timestamp
                ? complaint.timestamp.toDate().toLocaleString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                  })
                : ''
        ]);
    
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(field => `"${field}"`).join(','))
        ].join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'complaints.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    

    return (
        <div className="w-7xl mt-6 mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">CSV Download</h2>

            <div className="mb-4 flex justify-between items-center">
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="policeStationSelect">
                        Select a Police Station
                    </label>
                    {loading ? (
                        <p>Loading police stations...</p>
                    ) : (
                        <select
                            id="policeStationSelect"
                            value={selectedStation}
                            onChange={(e) => setSelectedStation(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="">-- Select --</option>
                            {policeStations.map(station => (
                                <option key={station.id} value={station.id}>
                                    {station.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <hr className="my-6" />

            <h3 className="text-xl font-semibold mb-2">Complaints</h3>
            {selectedStation && (
                <button
                    onClick={downloadCSV}
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Download CSV
                </button>
            )}
            {loading ? (
                <p>Loading complaints...</p>
            ) : (
                <ul className="space-y-2">
                    {selectedStation ? (
                        complaints
                            .filter(complaint => complaint.police_station === selectedStation)
                            .map(complaint => (
                                <li key={complaint.id} className="p-4 border rounded-md shadow-sm bg-gray-50">
                                    <p><strong>Address:</strong> {complaint.address}</p>
                                    <p><strong>Complain Type:</strong> {complaint.complainType}</p>
                                    <p><strong>Description:</strong> {complaint.description}</p>
                                    <p><strong>Name:</strong> {complaint.name}</p>
                                    <p><strong>Phone:</strong> {complaint.phone}</p>
                                    <p><strong>Police Station:</strong> {
                                        policeStations.find(station => station.id === complaint.police_station)?.name || 'Unknown'
                                    }</p>
                                    <p><strong>Receptionist Name:</strong> {complaint.receptionistName}</p>
                                    <p><strong>Receptionist Mobile:</strong> {complaint.receptionistMobile}</p>
                                    <p><strong>Complain Register Time:</strong> {
                                        complaint.timestamp?.toDate().toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })
                                    }</p>
                                </li>
                            ))
                    ) : (
                        <p className="text-gray-500">Please select a police station to view complaints.</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default CsvDownload;
