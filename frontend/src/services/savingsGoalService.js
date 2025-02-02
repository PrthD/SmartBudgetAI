import axios from 'axios';
import { getToken } from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/savings-goal`;

const getAuthConfig = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

// Fetch the existing single doc (GET /api/savings-goal)
export const fetchSavingsGoal = async () => {
  try {
    const response = await axios.get(API_BASE_URL, getAuthConfig());
    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.error || 'Failed to fetch savings distribution.';
    throw new Error(errorMsg);
  }
};

// Create a new doc (POST /api/savings-goal)
export const createSavingsGoal = async (goalRatios, interval = 'monthly') => {
  try {
    const response = await axios.post(
      API_BASE_URL,
      { goalRatios, interval },
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.error ||
      'Failed to create new savings distribution.';
    throw new Error(errorMsg);
  }
};

// Update doc by ID (PUT /api/savings-goal/:id)
export const updateSavingsGoal = async (
  goalId,
  goalRatios,
  interval,
  totalSegregated
) => {
  try {
    const payload = {};
    if (goalRatios) payload.goalRatios = goalRatios;
    if (interval) payload.interval = interval;
    if (totalSegregated !== undefined) {
      payload.totalSegregated = totalSegregated;
    }

    const response = await axios.put(
      `${API_BASE_URL}/${goalId}`,
      payload,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.error || 'Failed to update savings distribution.';
    throw new Error(errorMsg);
  }
};

// Delete doc by ID (DELETE /api/savings-goal/:id)
export const deleteSavingsGoal = async (goalId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/${goalId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    const errorMsg =
      error.response?.data?.error || 'Failed to delete savings distribution.';
    throw new Error(errorMsg);
  }
};
