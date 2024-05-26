import { useNavigate, useLoaderData } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { getRecipe } from "../../api/recipes";
import { getUserByEmail } from "../../api/auth";

const Recipes = () => {
    const recipes = useLoaderData();
    const { user } = useAuth();
    const navigate = useNavigate();

    const vewRecipe = async (id) => {
        console.log(id);
        if (!user) {
            return toast.error("You are not logged in");
        }
        const recipe = await getRecipe(id);
        if (recipe.creatorEmail === user.email) {
            navigate(`/recipes/${id}`);
        }
        const dbUser = await getUserByEmail(user.email);
        if (user && dbUser.coin < 10) {
            navigate(`/coin`);
            return alert('Please buy a coin');
        }

    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Recipes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                    <div key={recipe._id} className="card mx-auto w-60 sm:w-80 lg:w-96 bg-base-100 shadow-xl">
                        <figure className="px-10 pt-10">
                            <img
                                src={recipe?.thumbnail}
                                alt={recipe?.RecipeName}
                                className="rounded-xl transition-transform duration-300 transform hover:scale-105"
                            />
                        </figure>
                        <div className="card-body items-center text-center">
                            <h2 className="card-title">{recipe?.RecipeName}</h2>
                            <p>Creator Email: {recipe?.creatorEmail}</p>
                            {recipe?.purchased_by.length !== 0 ? (
                                <div>
                                    <p>Purchased By</p>
                                    <div>
                                        <p>{recipe?.purchased_by.join(', ')}</p>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                            <p>Country: {recipe?.Country}</p>
                            <div>
                                <button onClick={() => vewRecipe(recipe._id)} className="btn btn-primary">
                                    View The Recipe
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Recipes;
