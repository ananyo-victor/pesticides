import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyTokens = (req, res, next) => {
    // console.log("Verifying tokens");
    
    try {
        const userToken = req.headers['authorization-user']?.split(' ')[1];
        // console.log(userToken);

        if (!userToken) {
            return res.status(401).json({ message: 'Unauthorized: Required tokens missing!' });
        }
        
        const decodedUser = jwt.verify(userToken, process.env.JWT_KEY);
        req.user = decodedUser;
        // console.log(decodedUser);
        next();
    } catch (error) {
        console.error("Token verification failed", error);
        return res.status(401).json({ message: 'Unauthorized: Token verification failed' }); 
    }
};