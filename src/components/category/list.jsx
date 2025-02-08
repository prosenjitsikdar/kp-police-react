import React from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

const ListCategory = ({ categories, onCategoryAdded }) => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    const handleDelete = async (categoryId) => {
        try {
            await deleteDoc(doc(db, 'category', categoryId));
            onCategoryAdded((prevCategories) => prevCategories.filter((category) => category.id !== categoryId)); // Update parent state
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="w-7xl mt-6 mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Category List</h2>
            <table className="min-w-full table-auto">
                <thead>
                <tr>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Category Name</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Notification Type</th>
                    <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((category) => (
                    <tr key={category.id} className="border-t border-gray-200">
                        <td className="px-6 py-2 text-sm text-gray-700">{category.categoryName}</td>
                        <td className="px-6 py-2 text-sm text-gray-700">{category.notificationType}</td>
                        <td className="px-6 py-2 text-sm text-gray-700">
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListCategory;
