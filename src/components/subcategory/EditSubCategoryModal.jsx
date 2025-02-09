import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase'; // Import Firestore methods
import { doc, updateDoc } from 'firebase/firestore';

const EditSubCategoryModal = ({ subCategory, categories, onClose, onSubCategoryUpdated }) => {
    const [subCategoryName, setSubCategoryName] = useState(subCategory.name);
    const [catId, setCatId] = useState(subCategory.cat_id);

    useEffect(() => {
        setSubCategoryName(subCategory.name);
        setCatId(subCategory.cat_id);
    }, [subCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedSubCategory = {
            name: subCategoryName,
            cat_id: catId,
            createdAt: subCategory.createdAt, // Keep createdAt value intact
        };

        try {
            const subCategoryRef = doc(db, 'sub_category', subCategory.id);
            await updateDoc(subCategoryRef, updatedSubCategory);

            // Update the parent component state
            onSubCategoryUpdated((prevSubCategories) =>
                prevSubCategories.map((sub) =>
                    sub.id === subCategory.id ? { ...sub, ...updatedSubCategory } : sub
                )
            );

            onClose(); // Close modal after successful update
        } catch (error) {
            console.error('Error updating subcategory:', error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold text-center mb-4">Edit SubCategory</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="subCategoryName">
                            SubCategory Name
                        </label>
                        <input
                            type="text"
                            id="subCategoryName"
                            value={subCategoryName}
                            onChange={(e) => setSubCategoryName(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="catId">
                            Select Category
                        </label>
                        <select
                            id="catId"
                            value={catId}
                            onChange={(e) => setCatId(e.target.value)}
                            required
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                        >
                            Update SubCategory
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

export default EditSubCategoryModal;
