import React, { useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { getRecipe, updateRecipe } from '../../api/recipes';
import { getUserByEmail } from '../../api/auth';
import { updateUserCoin } from '../../api/bookings';
import InfiniteScroll from 'react-infinite-scroll-component';

const Recipes = () => {
    const allRecipes = useLoaderData();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [recipes, setRecipes] = useState(allRecipes.slice(0, 10));
    const [hasMore, setHasMore] = useState(true);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const handleCountryChange = (e) => {
        setCountryFilter(e.target.value);
    };

    const fetchMoreRecipes = () => {
        if (recipes.length >= allRecipes.length) {
            setHasMore(false);
            return;
        }
        setTimeout(() => {
            setRecipes(prevRecipes => [
                ...prevRecipes,
                ...allRecipes.slice(prevRecipes.length, prevRecipes.length + 10)
            ]);
        }, 1500);
    };

    const vewRecipe = async (id) => {
        if (!user) {
            return toast.error("You are not logged in");
        }
        try {
            const recipe = await getRecipe(id);
            console.log(recipe);
            if (recipe.creatorEmail === user.email) {
                return navigate(`/recipes/${id}`);
            }
            const dbUser = await getUserByEmail(user.email);
            if (dbUser.coin < 10) {
                navigate(`/coin`);
                return alert('Please buy a coin');
            }
            if (recipe.purchased_by.find(email => email === user.email)) {
                return navigate(`/recipes/${id}`);
            }
            if (user && recipe.creatorEmail !== user.email && dbUser.coin >= 10) {
                const confirmSpend = window.confirm("You will spend 10 coins to view this recipe. Do you want to proceed?");
                if (!confirmSpend) return;

                // Deduct 10 coins from the user
                await updateUserCoin(user.email, dbUser.coin - 10);

                // Add 1 coin to the creator
                const creator = await getUserByEmail(recipe.creatorEmail);
                await updateUserCoin(recipe.creatorEmail, creator.coin + 1);

                // Update the recipe data
                const updatedRecipe = {
                    email: user.email,
                };
                await updateRecipe(id, updatedRecipe);

                navigate(`/recipes/${id}`);
            }

        } catch (error) {
            console.error("Error viewing recipe:", error);
            toast.error("An error occurred while processing your request.");
        }
    };

    const filteredRecipes = recipes.filter(recipe => {
        return (
            recipe.RecipeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (categoryFilter === '' || recipe.Category === categoryFilter) &&
            (countryFilter === '' || recipe.Country.toLowerCase() === countryFilter.toLowerCase())
        );
    });

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Recipes</h1>
            <div className="mb-6 flex flex-wrap justify-between">
                <div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search by title..."
                        className="input input-bordered  w-40"
                    />
                </div>
                <div className="flex flex-col gap-2 md:flex-row">
                    <select value={categoryFilter} onChange={handleCategoryChange} className="select select-bordered">
                        <option value="">All Categories</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                    </select>
                    <input
                        type="text"
                        value={countryFilter}
                        onChange={handleCountryChange}
                        placeholder="Search by country..."
                        className="input input-bordered w-40"
                    />
                </div>
            </div>
            <InfiniteScroll
                dataLength={recipes.length}
                next={fetchMoreRecipes}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}><b>Yay! You have seen it all</b></p>}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map(recipe => (
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
            </InfiniteScroll>
        </div>
    );
};

export default Recipes;
