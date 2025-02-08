import React from 'react';

const PoliceStationList = ({ policeStations, handleDelete }) => {
    return (
        <div className="w-7xl mt-6 mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Police Station List</h2>

            {policeStations.length === 0 ? (
                <div className="text-center text-lg text-gray-600">No police stations available.</div>
            ) : (
                <table className="min-w-full table-auto">
                    <thead>
                    <tr>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Police Station Name</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Notification ID</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {policeStations.map((station) => (
                        <tr key={station.id} className="border-t border-gray-200">
                            <td className="px-6 py-2 text-sm text-gray-700">{station.name}</td>
                            <td className="px-6 py-2 text-sm text-gray-700">{station.notification_id}</td>
                            <td className="px-6 py-2 text-sm text-gray-700">
                                <button
                                    onClick={() => handleDelete(station.id)}
                                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default PoliceStationList;
