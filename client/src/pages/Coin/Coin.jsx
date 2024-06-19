import { useEffect, useState } from "react";
import { getUserByEmail } from "../../api/auth";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { GiTwoCoins } from "react-icons/gi";
import { coinData } from "./CoinData";
import BookingModal from "../../components/Modal/BookingModal";

const Coin = () => {
    const [dbUser, setDbUser] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [bookingInfo, setBookingInfo] = useState('');
    const closeModal = () => {
        setIsOpen(false);
    }
    const { user } = useAuth();
    useEffect(() => {
        const fetchDbUser = async () => {
            if (user && user?.email) {
                try {
                    const data = await getUserByEmail(user?.email);
                    setDbUser(data);
                } catch (error) {
                    console.error("Error fetching user:", error);
                    toast.error("Error fetching user");
                }
            }
        };

        fetchDbUser();
    }, [user]);

    if (!user) {
        return <p>Loading user...</p>;
    }
    const byCoin = (label) => {
        setIsOpen(true);
        const BookingCoin = coinData.find(coin => coin?.label === label);
        console.log(BookingCoin);
        setBookingInfo(BookingCoin);
    }

    return (
        <div>
            {dbUser ? (
                <div className="w-40 mx-auto">
                    <p className="btn btn-warning p-5 m-3 w-40 mx-auto">Your coin: {dbUser?.coin}</p>
                </div>
            ) : (
                <p>Loading coin data...</p>
            )}
            <p className="text-center text-2xl text-green-400">By Coin</p>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-5">
                {coinData?.map((item, index) => (
                    <div onClick={() => byCoin(item?.label)} key={index} className="card mx-auto w-60 p-5 bg-green-400 shadow-xl text-center hover:bg-green-500 transition duration-300">
                        <div className="flex gap-3 justify-center">
                            <p className="text-2xl">{item?.coin}</p>
                            <p className="text-2xl"><GiTwoCoins /></p>
                        </div>
                        <p className="text-2xl">{item?.dollar} $</p>
                    </div>
                ))}
            </div>
            <BookingModal closeModal={closeModal} isOpen={isOpen} bookingInfo={bookingInfo} />
        </div>
    );
};

export default Coin;
