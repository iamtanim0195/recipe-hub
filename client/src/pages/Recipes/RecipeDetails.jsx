import { useLoaderData } from "react-router-dom";

const RecipeDetails = () => {
    const recipe = useLoaderData();
    const { RecipeName, Video, creatorEmail, watchCount, purchased_by, RecipeDetails, Country } = recipe
    return (
        <div className="w-ful">
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
            <div className="p-3 ">
                <p> <span className="font-semibold">Recipe Name:</span> {RecipeName}</p>
                <p> <span className="font-semibold">Recipe Details:</span> {RecipeDetails} </p>
                <p> <span className="font-semibold">Creator Email:</span>  {creatorEmail}</p>
                <p> <span className="font-semibold">Country:</span>  {Country}</p>
                <p> <span className="font-semibold">WatchCount: </span>{watchCount} </p>
                {
                    purchased_by.length != 0 ? <div>
                        <p className="font-semibold">Purchased By</p>
                        <div>
                            <p>{purchased_by}</p>
                        </div>
                    </div> : <></>
                }
            </div>
        </div>
    )
}

export default RecipeDetails