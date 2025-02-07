import React, { useState } from "react";
import axios from "axios";

function UpdateCategory({ categories, setCategories }) {
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCategoryChange = (event) => {
        setSelectedCategoryId(event.target.value);
    };

    const handleNewCategoryNameChange = (event) => {
        setNewCategoryName(event.target.value);
    };

    const handleCategoryUpdate = async () => {
        if (!selectedCategoryId || !newCategoryName.trim()) {
            alert("Please select a category and provide a valid new name.");
            return;
        }

        setIsLoading(true); // Show a loading state during the API call
        try {
            const response = await axios.put(
                `https://digital-menu-7ohp.onrender.com/update-category/${selectedCategoryId}`,
                { name: newCategoryName.trim() }
            );

            if (response.status === 200) {
                // Update the category list locally
                setCategories((prevCategories) =>
                    prevCategories.map((category) =>
                        category.id === parseInt(selectedCategoryId)
                            ? { ...category, name: newCategoryName.trim() }
                            : category
                    )
                );
                alert("Category updated successfully!");
                setSelectedCategoryId("");
                setNewCategoryName("");
            }
        } catch (error) {
            console.error("Error updating category:", error.response?.data || error.message);
            alert(error.response?.data?.detail || "Failed to update category.");
        } finally {
            setIsLoading(false); // End the loading state
        }
    };

    return (
        <div className="edit-category-form" style={{display:"grid"}}>
            <h4>Edit Existing Category</h4>
            <select
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="category-select"
            >
                <option value="">Select Category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={newCategoryName}
                onChange={handleNewCategoryNameChange}
                placeholder="Enter new category name"
                className="category-input"
            />
            <button
                type="button"
                onClick={handleCategoryUpdate}
                className="submit-category-button"
                disabled={isLoading} // Disable button while updating
            >
                {isLoading ? "Updating..." : "Update Category"}
            </button>
        </div>
    );
}

export default UpdateCategory;
