import mongoose from "mongoose";
import { applyForJobService, isJobAppliedService, getAppService } from '../../service/userServices/applicationService.js';

export const applyForJob = async (req, res) => {
  const response = await applyForJobService(req);
  if (response.success) {
    return res.status(200).json(response);
  } else if (response.message === 'User has already applied for this job.') {
    return res.status(400).json(response);
  } else {
    return res.status(500).json(response);
  }
};

export const isJobApplied = async (req, res) => {
  const response = await isJobAppliedService(req);
  if (response.applied) {
    return res.status(200).json(response);
  } else if (response.message === 'Internal server error') {
    return res.status(500).json(response);
  } else {
    return res.status(200).json(response);
  }
};

export const getApp = async (req, res) => {
  const response = await getAppService(req);
  if (response.success) {
    return res.status(200).json(response);
  } else if (response.message === 'Invalid Job ID') {
    return res.status(400).json(response);
  } else if (response.message === 'No applications found for this job') {
    return res.status(404).json(response);
  } else {
    return res.status(500).json(response);
  }
};