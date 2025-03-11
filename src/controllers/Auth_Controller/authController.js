import { signUpUserService, signUpHRService, signInService } from '../../service/authServices/authService.js';

export const signUpUser = async (req, res) => {
  const response = await signUpUserService(req);
  if (response.success) {
    return res.status(201).json(response);
  } else if (response.message === "User already exists") {
    return res.status(400).json(response);
  } else {
    return res.status(500).json(response);
  }
};

export const signUpHR = async (req, res) => {
  const response = await signUpHRService(req);
  if (response.success) {
    return res.status(201).json(response);
  } else if (response.message === "HR already exists") {
    return res.status(400).json(response);
  } else {
    return res.status(500).json(response);
  }
};

export const signIn = async (req, res) => {
  const response = await signInService(req);
  if (response.success) {
    return res.status(200).json(response);
  } else if (response.message === "User not found" || response.message === "Invalid password") {
    return res.status(400).json(response);
  } else {
    return res.status(500).json(response);
  }
};

// export { signUpUser, signUpHR, signIn };
