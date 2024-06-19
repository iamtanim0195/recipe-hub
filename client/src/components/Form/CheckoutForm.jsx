import { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { updateUserCoin } from '../../api/bookings';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { getUserByEmail } from '../../api/auth';

const CheckoutForm = ({ bookingInfo, closeModal }) => {
    const { user } = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [emailInput, setEmailInput] = useState('');

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await fetch("https://recipehubserver.vercel.app/create-payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: bookingInfo?.dollar }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const { clientSecret } = await response.json();
                console.log(clientSecret);
                setClientSecret(clientSecret);
            } catch (error) {
                console.error('Error fetching client secret:', error);
            }
        };
        fetchClientSecret();
    }, [bookingInfo]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!elements || !stripe) {
            return;
        }
        const card = elements.getElement(CardElement);
        if (!card) {
            return;
        }

        try {
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        email: user?.email,
                        name: user?.displayName,
                    },
                },
            });

            if (confirmError) {
                throw confirmError;
            }

            if (paymentIntent?.status === 'succeeded') {
                toast.success('Payment Successful');
                const dbUser = await getUserByEmail(user.email);
                await updateUserCoin(user.email, dbUser.coin + bookingInfo.coin);
                closeModal();
                window.location.reload();
            } else {
                throw new Error('Payment not successful');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='px-4'>
            <CardElement />
            <button type="submit" disabled={!stripe || !elements || !clientSecret}>
                Pay
            </button>
            {errorMessage && <div>{errorMessage}</div>}
        </form>
    );
};

export default CheckoutForm;
