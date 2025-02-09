import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import EditSubCategoryModal from './EditSubCategoryModal'; // Import EditSubCategoryModal

const ListSubCategory = ({ subCategories, categories, setSubCategories }) => {
    const [editingSubCategory, setEditingSubCategory] = useState(null);

    // Function to handle deletion
    const handleDelete = async (subCategoryId) => {
        try {
            await deleteDoc(doc(db, 'sub_category', subCategoryId));
            setSubCategories((prevSubCategories) =>
                prevSubCategories.filter((subCategory) => subCategory.id !== subCategoryId)
            );
            console.log(`SubCategory with id ${subCategoryId} deleted successfully.`);
        } catch (error) {
            console.error('Error deleting subcategory:', error);
        }
    };

    // Function to handle edit
    const handleEdit = (subCategory) => {
        setEditingSubCategory(subCategory);
    };

    const closeEditModal = () => {
        setEditingSubCategory(null);
    };

    return (
        <div className="w-7xl mt-6 mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">SubCategory List</h2>

            {subCategories.length === 0 ? (
                <div className="text-center text-lg text-gray-600">No subcategories available.</div>
            ) : (
                <table className="min-w-full table-auto">
                    <thead>
                    <tr>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">SubCategory Name</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                        <th className="px-6 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {subCategories.map((subCategory) => (
                        <tr key={subCategory.id} className="border-t border-gray-200">
                            <td className="px-6 py-2 text-sm text-gray-700">{subCategory.name}</td>
                            <td className="px-6 py-2 text-sm text-gray-700">
                                {
                                    categories.find(category => category.id === subCategory.cat_id)?.name || 'Unknown Category'
                                }
                            </td>
                            <td className="px-6 py-2 text-sm text-gray-700">
                                <button
                                    onClick={() => handleEdit(subCategory)}
                                    className="text-blue-600 hover:text-blue-800 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(subCategory.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {editingSubCategory && (
                <EditSubCategoryModal
                    subCategory={editingSubCategory}
                    categories={categories}
                    onClose={closeEditModal}
                    onSubCategoryUpdated={setSubCategories}
                />
            )}
        </div>
    );
};

export default ListSubCategory;
