import jwt from 'jsonwebtoken';

export const verifyTokens = (req , res , next ) => {
    try {
        const userToken = req.header['authoriaztion-user']?.split(' ')[1];
        const hrToken = req.header['authoriaztion-hr']?.split(' ')[1];
        const jobToken = req.header['authoriaztion-job']?.split(' ')[1];

        if(!userToken || !hrToken || !jobToken) {
            return res.status(401).json({ message: 'Unauthorized : Required tokens Missing!' });}

    

     const decodedUser = jwt.verify(userToken , process.env.SECRET_KEY);
     const decodedHr = jwt.verify(hrToken , process.env.SECRET_KEY);
     const decodedJob = jwt.verify(userToken , process.env.SECRET_KEY);

     req.user = decodedUser
     req.hr = decodedHr
     req.job = decodedJob

        next();
        }
        catch (error) 
        {
            console.error("Token verification failed", error);
            return res.status(401).json({ message: 'Unauthorized : Token verification failed' });
        }
}