'use client';

// Explicitly re-export all named exports from users.ts
export { 
  registerUser,
  getUserById,
  updateUserProfile,
  getUsersByRole,
  changeUserRole,
  verifyPassword,
  users
} from './users';
