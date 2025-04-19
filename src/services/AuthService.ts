import { defaultAdminCredentials, AdminCredentials } from '../models/auth';

// Simple encryption key (in a real app, this would be more secure)
const ENCRYPTION_KEY = 'p@SSw0rd-3NCrypt10n-k3y!';

class AuthService {
  private isAuthenticated: boolean = false;
  private adminCredentials: AdminCredentials;

  constructor() {
    // Initialize with default admin credentials
    this.adminCredentials = { ...defaultAdminCredentials };
    
    // Encrypt the default password on initialization
    // This simulates setting up the admin account with an encrypted password
    this.setupDefaultAdmin();
  }

  private setupDefaultAdmin() {
    // Default
    const dp = 'whycannotlogin';
    
    // Encrypt and store the password
    this.adminCredentials.encryptedPassword = this.encryptPassword(dp);
    
    console.log('Admin account initialized with encrypted password');
  }

  // Simple encryption algorithm (for demonstration purposes)
  // In a real application, use a proper encryption library
  encryptPassword(password: string): string {
    let encrypted = '';
    for (let i = 0; i < password.length; i++) {
      const charCode = password.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      // XOR operation for simple encryption
      encrypted += String.fromCharCode(charCode ^ keyChar);
    }
    // Convert to base64 for storage
    return btoa(encrypted);
  }

  // Decrypt the password
  decryptPassword(encryptedPassword: string): string {
    // Decode from base64
    const encrypted = atob(encryptedPassword);
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const charCode = encrypted.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      // XOR operation for decryption
      decrypted += String.fromCharCode(charCode ^ keyChar);
    }
    return decrypted;
  }

  // Login function - returns true if login is successful
  login(username: string, password: string): boolean {
    // Check if username matches
    if (username !== this.adminCredentials.username) {
      return false;
    }

    // Decrypt the stored password and compare
    const decryptedStoredPassword = this.decryptPassword(this.adminCredentials.encryptedPassword);
    if (password !== decryptedStoredPassword) {
      return false;
    }

    // Set authentication flag
    this.isAuthenticated = true;
    
    // Store auth token in local storage for persistence
    localStorage.setItem('isAuthenticated', 'true');
    
    return true;
  }

  // Logout function
  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('isAuthenticated');
  }

  // Check if user is authenticated
  getIsAuthenticated(): boolean {
    // Check local storage for persistent auth across page refreshes
    if (localStorage.getItem('isAuthenticated') === 'true') {
      this.isAuthenticated = true;
    }
    return this.isAuthenticated;
  }
}

// Create and export a singleton instance
export default new AuthService();
