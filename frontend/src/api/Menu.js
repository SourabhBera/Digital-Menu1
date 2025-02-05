import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const fetchMenu = async () => {
    try {
      const response = await axios.get(`${API_URL}/menu`); 
      console.log(response.data)
      return response.data;
    } catch (err) {
      throw new Error("Failed to fetch menu data");
    }
  };
  