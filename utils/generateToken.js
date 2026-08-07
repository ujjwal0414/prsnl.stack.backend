import jwt from "jsonwebtoken";
export const generateRefreshToken = (userData) => {
    return jwt.sign({
            userEmail:userData.userEmail,
            role:userData.role
        },process.env.REFRESH_TOKEN_KEY,{
            expiresIn:"1d"
        })
}