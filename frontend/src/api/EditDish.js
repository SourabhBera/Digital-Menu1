
const BASE_URL = "http://127.0.0.1:8000";

export const fetchCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error(`Error fetching categories: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchDishesByCategory = async (categoryId) => {
  if (!categoryId) return [];
  try {
    const res = await fetch(`${BASE_URL}/menu/dishes/?category_id=${categoryId}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return [];
  }
};

export const fetchDishDetails = async (dishId) => {
  if (!dishId) return null;
  try {
    const res = await fetch(`${BASE_URL}/dish/${dishId}`);
    if (!res.ok) throw new Error(`Error fetching dish details: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateDish = async (selectedDish, dishData) => {
  if (!selectedDish) {
    alert("Please select a dish to update.");
    return;
  }

  const formData = new FormData();
  formData.append("dish_name", dishData.dish_name);
  formData.append("category_id", dishData.category_id);
  formData.append("dish_type", dishData.dish_type);
  formData.append("description", dishData.description);
  formData.append("price", dishData.price);

  if (dishData.image) {
    formData.append("image", dishData.image);
  }

  if (dishData.video) {
    formData.append("video", dishData.video);
  }

  try {
    const res = await fetch(`http://localhost:8000/admin/update-dish/${selectedDish}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) throw new Error(`Error updating dish: ${res.status}`);
    const data = await res.json();
    alert(data.message);
  } catch (error) {
    console.error("Error updating dish:", error);
    console.log("Error updating dish:", dishData);
  }
};

export const deleteDish = async (selectedDish) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/delete/${selectedDish}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Error deleting dish: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Error deleting dish:", error);
    console.log(error)
    return null;
  }
};
