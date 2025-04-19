// This file stores encrypted admin credentials
// In a real application, these would be stored in a secure database
export interface AdminCredentials {
  username: string;
  // This will store an encrypted password
  encryptedPassword: string;
}

// Default admin credentials (password will be replaced with encrypted version)
export const defaultAdminCredentials: AdminCredentials = {
  username: 'admin',
  encryptedPassword: '' // Will be set during application initialization
};
