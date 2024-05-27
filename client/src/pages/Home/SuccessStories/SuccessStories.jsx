import { useEffect, useState } from 'react';
import CountUp from 'react-countup';

const SuccessStories = ({ allRecipes, allUsers }) => {
    const [recipesCount, setRecipesCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    const AllRecipes = allRecipes.length;
    const AllUsers = allUsers.length;
    // Simulated data fetching 
    useEffect(() => {

        const fetchRecipesCount = () => {
            setTimeout(() => {
                setRecipesCount(AllRecipes);
            }, 1000);
        };

        // Simulated API call to fetch users count
        const fetchUsersCount = () => {
            setTimeout(() => {
                setUsersCount(AllUsers);
            }, 1500);
        };

        fetchRecipesCount();
        fetchUsersCount();
    }, []);

    return (
        <div className="bg-gray-100 py-10">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-6">Success Stories</h2>
                <div className="flex justify-center items-center space-x-8">
                    <div className="text-center">
                        <h3 className="text-4xl font-bold text-blue-600">
                            <CountUp end={recipesCount} duration={3} />
                        </h3>
                        <p className="text-lg font-semibold text-gray-600">Recipes Created</p>
                    </div>
                    <div className="text-center">
                        <h3 className="text-4xl font-bold text-blue-600">
                            <CountUp end={usersCount} duration={3} />
                        </h3>
                        <p className="text-lg font-semibold text-gray-600">Users Registered</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessStories;
