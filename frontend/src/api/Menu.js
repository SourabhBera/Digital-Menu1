import axios from "axios";

const API_URL = "https://digital-menu-7ohp.onrender.com";

export const fetchMenu = async () => {
    try {
      const response = await axios.get(`${API_URL}/menu`); 
      console.log(response.data)
      return response.data;
    } catch (err) {
      throw new Error("Failed to fetch menu data");
    }
  };
  