import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import Recipes from "../pages/Recipes/Recipes";
import PrivateRoute from "./PrivateRoute";
import AddRecipes from "../pages/AddRecipes/AddRecipes";
import { getAllRecipes } from "../api/recipes";

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
                loader: () => getAllRecipes(),
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