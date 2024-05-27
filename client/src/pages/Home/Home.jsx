import { useLoaderData } from "react-router-dom";
import Banner from "./Banner/Banner"
import SuccessStories from "./SuccessStories/SuccessStories"
import DevInfo from "./DevInfo/DevInfo";


const Home = () => {
    const { allRecipes, allUsers } = useLoaderData();

    return (
        <div>
            <Banner />
            <SuccessStories allRecipes={allRecipes} allUsers={allUsers}  />
            <DevInfo />
        </div>
    )
}

export default Home