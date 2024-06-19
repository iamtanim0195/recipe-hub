import axiosSecure from ".";

//Fetch all recipes from db
export const getAllRecipes = async () => {
    const { data } = await axiosSecure("/recipes")
    return data
}
// Fetch single recipe from db
export const getRecipe = async (id) => {
    const { data } = await axiosSecure(`/recipes/${id}`)
    return data
};

//save a recipe data in db
export const addRecipe = async (recipeData) => {
    const { data } = await axiosSecure.post("/recipe", recipeData)
    return data;
};
// Update the recipe data
export const updateRecipe = async (id, updatedRecipe) => {
    try {
        const { data } = await axiosSecure.put(`/recipes/${id}`, updatedRecipe);
        return data;
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
};

// Update like status of a recipe
export const updateLikeStatus = async (id, liked) => {
    try {
        const { data } = await axiosSecure.patch(`/recipes/${id}/like`, { liked });
        return data;
    } catch (error) {
        console.error('Error updating like status:', error);
        throw error;
    }
};