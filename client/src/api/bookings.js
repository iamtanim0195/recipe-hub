import axiosSecure from '.'

// create payment intent
export const createPaymentIntent = async price => {
    const { data } = await axiosSecure.post('/create-payment-intent', price)
    return data
}

// update user coin
export const updateUserCoin = async (email, coin) => {
    const { data } = await axiosSecure.patch(`/users/coin/${email}`, { coin })
    return data
}
