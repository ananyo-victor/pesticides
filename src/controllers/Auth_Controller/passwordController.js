
import { forgotPassword, resetPassword } from "../../service/authServices/passwordService.js";
export const forgotPasswordC = async (req, res) => {
    try {
        const message = await forgotPassword(req.body.email, req);
        res.json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const resetPasswordC = async (req, res) => {
    try {
        const message = await resetPassword(req.params.token, req.body.password);
        res.json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
