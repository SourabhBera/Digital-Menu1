import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminHome.css";
import axios from "axios";
import UpdateCategory from "./UpdateCategory";

function AdminHome() {
    const [showUploadSection, setShowUploadSection] = useState(false);
    const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
    const [showEditCategoryForm, setShowEditCategoryForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const uploadSectionRef = useRef(null);
    const navigate = useNavigate();
    const [carouselFile, setCarouselFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);  

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/categories");
            if (response.status === 200) {
                console.log(response.data)
                setCategories(response.data);
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error) {
            console.error("Error fetching categories:", error.response?.data || error.message);
            alert(error.response?.data?.detail || "Failed to fetch categories.");
        }
    };
    

    useEffect(() => {
        const fetchCategoriesOnMount = async () => {
            try {
                await fetchCategories();
            } catch (error) {
                console.error("Error during fetchCategories:", error);
            }
        };
    
        fetchCategoriesOnMount();
    }, []);

    useEffect(() => {
        if (showUploadSection || showAddCategoryForm || showEditCategoryForm) {
            uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [showUploadSection, showAddCategoryForm, showEditCategoryForm]);

    const [isLoading, setIsLoading] = useState(false);

    const addCategory = async (categoryName) => {
    setIsLoading(true);
    try {
        const response = await axios.post("http://127.0.0.1:8000/admin/create-category", { name: categoryName });
        if (response.status === 201) {
            console.log("Category added:", response.data);
            setCategories((prev) => [...prev, categoryName]);
            alert("Category added successfully!");
        }
    } catch (error) {
        console.error("Error adding category:", error.response?.data || error.message);
        alert(error.response?.data?.detail || "Failed to add category.");
    } finally {
        setIsLoading(false);
    }
};


    const handleEditCarouselClick = () => {
        setShowUploadSection(true);
        setShowAddCategoryForm(false);
        setShowEditCategoryForm(false);
    };

    const handleAddCategoryClick = () => {
        setShowAddCategoryForm(true);
        setShowUploadSection(false);
        setShowEditCategoryForm(false);
    };
    
    const handleEditCategoryClick = () => {
        setShowEditCategoryForm(true);
        setShowAddCategoryForm(false);
        setShowUploadSection(false);
    };

    const handleRedirect = (path) => {
        navigate(path);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        setNewCategoryName(event.target.value);
    };

    const handleCategoryUpdate = async () => {
        if (!selectedCategory || !newCategoryName.trim()) {
            alert("Please select a category and provide a valid new name.");
            return;
        }
    
        try {
            const response = await axios.put("http://127.0.0.1:8000/admin/update-category", {
                oldName: selectedCategory,
                newName: newCategoryName.trim(),
            });
    
            if (response.status === 200) {
                setCategories(categories.map((cat) => (cat === selectedCategory ? newCategoryName.trim() : cat)));
                alert("Category updated successfully!");
                setSelectedCategory("");
                setNewCategoryName("");
            }
        } catch (error) {
            console.error("Error updating category:", error.response?.data || error.message);
            alert(error.response?.data?.detail || "Failed to update category.");
        }
    };
    


    return (
        <>
            <div className="admin-home">
                <div className="logo-section">
                    <logo />
                </div>
                <div className="content-section">
                    <div className="admin-actions">
                        
                        
                        <button className="button-48" onClick={() => handleRedirect("/admin/add-dishes")}>
                            <span className="text">Add Dishes</span>
                        </button>
                        <br />
                        <button className="button-48" onClick={() => handleRedirect("/admin/edit-dish")}>
                            <span className="text">Edit Dishes</span>
                        </button>
                        <br />
                        <button className="button-48" onClick={handleAddCategoryClick}>
                            <span className="text">Add Category</span>
                        </button>
                        <br />
                        <button className="button-48" onClick={handleEditCategoryClick}>
                            <span className="text">Edit Category</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="add-category">
                {showAddCategoryForm && (
                    <>
                        <h4>Add New Category</h4>
                        <div className="add-category-form">
                            <input
                                type="text"
                                placeholder="Enter category name"
                                className="category-input"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <br />
                            <button
                                type="button"
                                className="submit-category-button"
                                onClick={async () => {
                                    if (newCategoryName.trim()) {
                                        const response = await addCategory(newCategoryName);
                                        if (response) {
                                            setCategories((prev) => [...prev, newCategoryName]);
                                            setNewCategoryName("");
                                            alert("Category added successfully!");
                                        }
                                    } else {
                                        alert("Category name cannot be empty.");
                                    }
                                }}
                            >
                                Add Category
                            </button>
                        </div>
                    </>
                )}
            </div>
            <div className="update-category" >
                {showEditCategoryForm && (
                    <UpdateCategory
                        categories={categories}
                        setCategories={setCategories}
                    />
                )}
            </div>
        </>
    );
}

export default AdminHome;

