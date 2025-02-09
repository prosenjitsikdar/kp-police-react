import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const EditCategoryModal = ({ category, onClose, onCategoryUpdated }) => {
    const [categoryName, setCategoryName] = useState(category.categoryName);
    const [notificationStatus, setNotificationStatus] = useState(category.notificationStatus);
    const [notificationType, setNotificationType] = useState(category.notificationType);

    // Effect to reset notificationType when notificationStatus is unchecked
    useEffect(() => {
        if (!notificationStatus) {
            setNotificationType('none');
        }
    }, [notificationStatus]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedCategory = {
            categoryName,
            notificationStatus,
            notificationType,
            createdAt: category.createdAt, // Keep the same createdAt value
        };

        try {
            const categoryRef = doc(db, 'category', category.id);
            await updateDoc(categoryRef, updatedCategory);

            // Update the categories in the parent component
            onCategoryUpdated((prevCategories) =>
                prevCategories.map((cat) =>
                    cat.id === category.id ? { ...cat, ...updatedCategory } : cat
                )
            );

            onClose(); // Close the modal after updating
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold text-center mb-4">Edit Category</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="categoryName">
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            id="notificationStatus"
                            checked={notificationStatus}
                            onChange={(e) => setNotificationStatus(e.target.checked)}
                            className="h-4 w-4 text-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700" htmlFor="notificationStatus">
                            Enable Notifications
                        </label>
                    </div>

                    {notificationStatus && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700" htmlFor="notificationType">
                                Notification Type
                            </label>
                            <select
                                id="notificationType"
                                value={notificationType}
                                onChange={(e) => setNotificationType(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="High Priority">High Priority</option>
                                <option value="Medium Priority">Medium Priority</option>
                                <option value="Low Priority">Low Priority</option>
                                <option value="none">None</option> {/* Add 'None' option */}
                            </select>
                        </div>
                    )}

                    <div className="flex justify-center space-x-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                        >
                            Update Category
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategoryModal;
