import axiosSecure from ".";
//save user data in db
export const saveUser = async user => {
    const currentUser = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        coin: 50,
    }
    const { data } = await axiosSecure.put(`/users/${user?.email}`, currentUser)
    return data
}
//get token form server
export const getToken = async email => {
    const { data } = await axiosSecure.post(`/jwt`, email)
    console.log("token received from server")
    return data
}
// remove the token from the browser
export const clearCookie = async () => {
    const { data } = await axiosSecure.get(`/logout`)
    return data
}

//all user get
export const getUsers = async () => {
    const { data } = await axiosSecure.get('/users')
    return data
}
//all user get by email
export const getUserByEmail = async (email) => {
    const { data } = await axiosSecure.get(`/users/${email}`)
    return data
}

// get user rool
export const getRole = async (email) => {
    const { data } = await axiosSecure.get(`/users/${email}`)
    return data.role
}
//update role
export const updateRole = async ({ email, role }) => {
    const currentUser = {
        email, role,
        status: 'Verified',
    }
    const { data } = await axiosSecure.put(`/users/update/${email}`, currentUser)
    return data
}