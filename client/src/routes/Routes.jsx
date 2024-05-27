import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import Recipes from "../pages/Recipes/Recipes";
import PrivateRoute from "./PrivateRoute";
import AddRecipes from "../pages/AddRecipes/AddRecipes";
import { getAllRecipes, getRecipe } from "../api/recipes";
import { getUserByEmail, getUsers } from "../api/auth";
import useAuth from "../hooks/useAuth";
import RecipeDetails from "../pages/Recipes/RecipeDetails";
import PrivateRecipe from "./PrivateRecipe";
import Coin from "../pages/Coin/Coin";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
                loader: async () => {
                    const allRecipes = await getAllRecipes();
                    const allUsers = await getUsers();
                    return { allRecipes, allUsers };
                }
            },
            {
                path: "/recipes",
                element: <Recipes />,
                loader: async () => await getAllRecipes(),
            },
            {
                path: "/coin",
                element: <Coin />,
            },
            {
                path: "/recipes/:id",
                element: (
                    <PrivateRecipe>
                        <RecipeDetails />
                    </PrivateRecipe>
                ),
                loader: ({ params }) => getRecipe(params.id)
            },
            {
                path: "/add-recipes",
                element: (
                    <PrivateRoute>
                        <AddRecipes />
                    </PrivateRoute>
                ),
            },
        ]
    }
]);