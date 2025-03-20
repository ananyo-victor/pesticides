import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import User from "../../models/user.js"; 
import HR from "../../models/hr.js"

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const forgotPassword = async (email,req) => {
    const user = await User.findOne({ email }) || await HR.findOne({ email });  
    if (!user) throw new Error("User not found");

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '15m' });
    const frontendURL = req?.headers?.origin;
    const resetLink = `${frontendURL}/reset-password/${token}`;

console.log(frontendURL);
    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: "Password Reset Link",
        text: `Click the link to reset your password: ${resetLink}`,
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    await sgMail.send(msg);
    return "Password reset email sent";
};

export const resetPassword = async (token, newPassword) => {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findById(decoded.id);

    if (user){
        user.password = hashedPassword;
        await user.save();
    } 
    else{
        const hr = await HR.findById(decoded.id);
        if(!hr) throw new Error("Invalid or expired token");
        if(hr){
            hr.password = hashedPassword;
            await hr.save();
        }
    }
    
    return "Password reset successful";
};
