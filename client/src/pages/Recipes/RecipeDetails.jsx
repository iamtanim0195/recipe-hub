import { useLoaderData } from "react-router-dom";
import { updateLikeStatus, getAllRecipes } from "../../api/recipes";
import { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { Link } from "react-router-dom";

const RecipeDetails = () => {
    const recipe = useLoaderData();
    const { RecipeName, Video, creatorEmail, watchCount, purchased_by, RecipeDetails, Country, _id, Category } = recipe;
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(recipe.likeCount);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        // Set initial like status and count
        setLiked(recipe.liked);
        setLikeCount(recipe?.likeCount);
        // Fetch related recipes
        fetchRelatedRecipes();
    }, [recipe]);

    const fetchRelatedRecipes = async () => {
        try {
            const allRecipes = await getAllRecipes();
            const relatedRecipes = allRecipes.filter(r =>
                r._id !== _id && (r.Category === Category || r.Country === Country)
            );
            setSuggestions(relatedRecipes);
        } catch (error) {
            console.error('Error fetching related recipes:', error);
        }
    };

    const toggleLike = async () => {
        try {
            // Toggle the like status locally
            setLiked(!liked);
            // Update the like status in the database
            await updateLikeStatus(_id, !liked);
            // Update the like count if the like status changes
            setLikeCount(prevCount => liked ? prevCount - 1 : prevCount + 1);
        } catch (error) {
            console.error('Error toggling like status:', error);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-center p-3">
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${Video}?rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded YouTube Video"
                ></iframe>
            </div>
            <div className="p-3">
                <p> <span className="font-semibold">Recipe Name:</span> {RecipeName}</p>
                <p> <span className="font-semibold">Recipe Details:</span> {RecipeDetails} </p>
                <p> <span className="font-semibold">Creator Email:</span>  {creatorEmail}</p>
                <p> <span className="font-semibold">Country:</span>  {Country}</p>
                <p> <span className="font-semibold">Category:</span>  {Category}</p>
                <p> <span className="font-semibold">WatchCount: </span>{watchCount} </p>
                {
                    purchased_by.length !== 0 ? <div>
                        <p className="font-semibold">Purchased By</p>
                        <div>
                            <p>{purchased_by.join(', ')}</p>
                        </div>
                    </div> : null
                }
            </div>
            <div>
                <div className="flex items-center">
                    {liked ? (
                        <AiFillHeart className="text-red-500 cursor-pointer" onClick={toggleLike} />
                    ) : (
                        <AiOutlineHeart className="text-gray-500 cursor-pointer" onClick={toggleLike} />
                    )}
                    <p className="ml-1 cursor-pointer" onClick={toggleLike}>{liked ? 'Unlike' : 'Like'}</p>
                </div>
                <p>Like Count: {likeCount}</p>
            </div>
            <div className="mt-6">
                <h3 className="text-xl font-bold">Related Recipes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {suggestions.map(suggestion => (
                        <div key={suggestion._id} className="card w-full bg-base-100 shadow-xl">
                            <figure className="px-10 pt-10">
                                <img
                                    src={suggestion?.thumbnail}
                                    alt={suggestion?.RecipeName}
                                    className="rounded-xl transition-transform duration-300 transform hover:scale-105"
                                />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">{suggestion?.RecipeName}</h2>
                                <p>Country: {suggestion?.Country}</p>
                                <p>Category: {suggestion?.Category}</p>
                                <div>
                                    <Link to={`/recipes/${suggestion._id}`} className="btn btn-primary">
                                        View Recipe
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;
