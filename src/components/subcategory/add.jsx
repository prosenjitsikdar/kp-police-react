import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import ListSubCategory from './list.jsx'; // Your ListSubCategory component

const AddSubCategoryForm = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [subCategoryName, setSubCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [catId, setCatId] = useState('');
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // Fetch categories from Firestore
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'category'));
                const categoryList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().categoryName
                }));
                setCategories(categoryList);
                if (categoryList.length > 0) {
                    setCatId(categoryList[0].id); // Set the first category as default
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch all subcategories
    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const q = query(collection(db, 'sub_category'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);

                const subCategoryList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSubCategories(subCategoryList); // Set subcategories state
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        };

        fetchSubCategories();
    }, []); // Fetch once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();

        const subCategoryData = {
            name: subCategoryName,
            cat_id: catId,
            createdAt: new Date(),
        };

        try {
            // Add subcategory to Firestore
            const docRef = await addDoc(collection(db, 'sub_category'), subCategoryData);
            const newSubCategory = { id: docRef.id, ...subCategoryData };

            // Immediately update the state to reflect the added subcategory
            setSubCategories((prevSubCategories) => [newSubCategory, ...prevSubCategories]);

            console.log('SubCategory Added:', newSubCategory);

            // Clear input fields after submission
            setSubCategoryName('');
            setCatId(categories[0]?.id || ''); // Reset to the first category
        } catch (error) {
            console.error('Error adding subcategory: ', error);
        }
    };

    return (
        <>
            <div className="w-7xl mt-6 mx-auto p-6 bg-white drop-shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">Add New SubCategory</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="subCategoryName">
                            SubCategory Name
                        </label>
                        <input
                            type="text"
                            id="subCategoryName"
                            name="subCategoryName"
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
                            name="catId"
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

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                        >
                            Add SubCategory
                        </button>
                    </div>
                </form>
            </div>

            {/* Pass both subCategories and categories to the ListSubCategory */}
            <ListSubCategory subCategories={subCategories} categories={categories} setSubCategories={setSubCategories} />
        </>
    );
};

export default AddSubCategoryForm;
