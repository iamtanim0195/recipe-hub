import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home/Home";
import Recipes from "../pages/Recipes/Recipes";
import PrivateRoute from "./PrivateRoute";
import AddRecipes from "../pages/AddRecipes/AddRecipes";

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