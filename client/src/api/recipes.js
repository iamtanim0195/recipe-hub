import axiosSecure from ".";

//Fetch all recipes from db
export const getAllRecipes = async () =>{
    const {data} = await axiosSecure("/recipes")
    return data
}
// Fetch single recipe from db
export const getRecipe = async id => {
    const {data} = await axiosSecure.post(`/recipe/${id}`)
    return data
};

//save a recipe data in db
export const addRecipe = async (recipeData) => {
    const {data} = await axiosSecure.post("/recipes",recipeData)
    return data;
};