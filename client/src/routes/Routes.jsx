import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import Recipes from "../pages/Recipes/Recipes";
import PrivateRoute from "./PrivateRoute";
import AddRecipes from "../pages/AddRecipes/AddRecipes";
import { getAllRecipes, getRecipe } from "../api/recipes";
import { getUserByEmail } from "../api/auth";
import useAuth from "../hooks/useAuth";
import RecipeDetails from "../pages/Recipes/RecipeDetails";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/recipes",
                element: <Recipes />,
                loader: async () => await getAllRecipes(),
            },
            {
                path: "/recipes/:id",
                element: (
                    <PrivateRoute>
                        <RecipeDetails />
                    </PrivateRoute>
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