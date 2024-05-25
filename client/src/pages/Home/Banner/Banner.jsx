import { Link } from 'react-router-dom';
import fire from '../../../assets/videos/fire.mp4';

const Banner = () => {
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted>
                <source src={fire} type="video/mp4" />
            </video>
            <div className="relative  flex flex-col items-center justify-center w-full h-full text-white text-center bg-black bg-opacity-50">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">Connect with the cooking community</h1>
                <p className="mt-4 italic text-lg md:text-2xl lg:text-3xl">Get inspired and connect with other home cooks like you</p>
                <div className='flex gap-3 p-2'>
                    <Link to={`/recipes`} className="btn btn-success">See recipes</Link>
                    <Link to={'/add-recipes'} className="btn btn-warning">Add recipes</Link>
                </div>
            </div>
        </div>
    );
}

export default Banner;
