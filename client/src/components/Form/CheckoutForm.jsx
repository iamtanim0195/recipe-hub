import { useEffect, useState } from 'react';
import {
    useStripe,
    useElements,
    CardElement,
} from '@stripe/react-stripe-js';
import { updateUserCoin } from '../../api/bookings';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { getUserByEmail } from '../../api/auth';


const CheckoutForm = ({ bookingInfo,closeModal }) => {
    const { user } = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const [emailInput, setEmailInput] = useState('');

    console.log(bookingInfo);

    useEffect(() => {
        // create payment intent
        const clientSecret = async () => {
            const response = await fetch("http://localhost:8000/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ price: 90 }),
            });
            const { clientSecret } = await response.json();
            console.log(clientSecret);
            setClientSecret(clientSecret);
        }
        return () => clientSecret()

    }, [])
    console.log(clientSecret);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (elements == null || stripe == null) {
            return;
        }
        const card = elements.getElement(CardElement);
        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();

        if (submitError?.message) {
            // Show error to your customer
            setErrorMessage(submitError.message);
            return;
        }
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        })
        try {
            const { paymentIntent, error: confirmError } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: card,
                        billing_details: {
                            email: user?.email,
                            name: user?.displayName,
                        },
                    },
                })
            console.log(paymentIntent);
            if (paymentIntent.status === 'succeeded') {
                toast.success('Payment Successful');
                const dbUser = await getUserByEmail(user.email);
                const coinUpdate = await updateUserCoin(user.email, dbUser.coin + bookingInfo.coin);
                console.log(coinUpdate);
                closeModal();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }

    };


    return (
        <form onSubmit={handleSubmit} className='px-4'>
            <div className='mb-3'>
                <label htmlFor="email-input">Email</label>
                <div>
                    <input value={emailInput} onChange={(e => setEmailInput(e.target.value))} type="email" id="email-input" placeholder='johndoe@gmail.com' />
                </div>
            </div>
            <CardElement />
            <button type="submit" disabled={!stripe || !elements}>
                Pay
            </button>
            {/* Show error message to your customers */}
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    );
};

export default CheckoutForm;
