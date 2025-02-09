import React, { useState } from 'react';

const PoliceStationList = ({ policeStations, handleDelete, handleEdit }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedStation, setSelectedStation] = useState(null);

    const openEditModal = (station) => {
        setSelectedStation(station);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedStation(null);
    };

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
                                    onClick={() => openEditModal(station)}
                                    className="px-4 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-700 mr-2"
                                >
                                    Edit
                                </button>
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

            {/* Edit Modal */}
            {showModal && selectedStation && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-1/3">
                        <h3 className="text-xl font-semibold mb-4">Edit Police Station</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleEdit(selectedStation.id, selectedStation.name);
                                closeModal();
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                                    Police Station Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={selectedStation.name}
                                    onChange={(e) => setSelectedStation({ ...selectedStation, name: e.target.value })}
                                    required
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoliceStationList;
