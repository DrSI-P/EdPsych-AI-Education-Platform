'use client';

// Direct exports of all functions from users.ts
import { 
  registerUser as _registerUser,
  getUserById as _getUserById,
  updateUserProfile as _updateUserProfile,
  getUsersByRole as _getUsersByRole,
  changeUserRole as _changeUserRole,
  verifyPassword as _verifyPassword,
  users as _users
} from './users';

// Re-export with the same names
export const registerUser = _registerUser;
export const getUserById = _getUserById;
export const updateUserProfile = _updateUserProfile;
export const getUsersByRole = _getUsersByRole;
export const changeUserRole = _changeUserRole;
export const verifyPassword = _verifyPassword;
export const users = _users;
