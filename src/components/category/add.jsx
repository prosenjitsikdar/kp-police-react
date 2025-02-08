import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import ListCategory from './list.jsx';

const AddCategoryForm = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState('');
    const [notificationStatus, setNotificationStatus] = useState(false);
    const [notificationType, setNotificationType] = useState('none');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch categories ordered by 'createdAt' in descending order
                const q = query(collection(db, 'category'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const categoriesList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCategories(categoriesList); // Update state with fetched categories
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []); // Empty dependency array to fetch categories only once when the component mounts

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalNotificationType = notificationStatus ? notificationType : 'none';

        const categoryData = {
            categoryName,
            notificationStatus,
            notificationType: finalNotificationType,
            createdAt: new Date(),
        };

        try {
            const docRef = await addDoc(collection(db, 'category'), categoryData);
            const newCategory = { id: docRef.id, ...categoryData };
            setCategories((prevCategories) => [newCategory, ...prevCategories]); // Add new category at the start

            console.log('Category Added:', newCategory);

            setCategoryName('');
            setNotificationStatus(false);
            setNotificationType('none');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <>
            <div className="w-7xl mt-6 mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Add New Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="categoryName">
                            Category Name
                        </label>
                        <input
                            type="text"
                            id="categoryName"
                            name="categoryName"
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
                            name="notificationStatus"
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
                                name="notificationType"
                                value={notificationType}
                                onChange={(e) => setNotificationType(e.target.value)}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>Select Priority</option>
                                <option value="High Priority">High Priority</option>
                                <option value="Medium Priority">Medium Priority</option>
                                <option value="Low Priority">Low Priority</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                        >
                            Add Category
                        </button>
                    </div>
                </form>
            </div>

            {/* Pass the categories state and setCategories function to ListCategory */}
            <ListCategory categories={categories} onCategoryAdded={setCategories} />
        </>
    );
};

export default AddCategoryForm;
