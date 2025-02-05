import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000"; 


const addCategory = async (categoryName) => {
    if (!categoryName.trim()) {
        alert("Category name cannot be empty.");
        return null;
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/admin/create-category`, {
            name: categoryName,
        });

        if (response.status === 201) {
            console.log("Category added:", response.data);
            return response.data;
        }
    } catch (error) {
        console.error("Error adding category:", error.response?.data || error.message);
        alert(error.response?.data?.detail || "Failed to add category.");
        return null;
    }
};


  
