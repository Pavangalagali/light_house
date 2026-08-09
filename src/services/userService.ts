import { UserProfile, OTPRequestState } from '../types';

const STORAGE_KEY_USERS = 'lighthouse_registered_users_v1';
const STORAGE_KEY_CURRENT_USER = 'lighthouse_current_user_phone_v1';
const STORAGE_KEY_ACTIVE_OTP = 'lighthouse_active_otp_request_v1';

/**
 * Helper to fetch all registered users stored in localStorage
 */
export function getAllUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error reading users from storage:', err);
    return {};
  }
}

/**
 * Helper to save all users to localStorage
 */
export function saveAllUsers(users: Record<string, UserProfile>): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users to storage:', err);
  }
}

/**
 * Retrieve user profile by phone number
 */
export function getUserProfile(phone: string): UserProfile | null {
  const cleanPhone = phone.trim().replace(/\D/g, '');
  if (!cleanPhone) return null;
  const users = getAllUsers();
  return users[cleanPhone] || null;
}

/**
 * Save or update a user profile
 */
export function saveUserProfile(profile: UserProfile): UserProfile {
  const cleanPhone = profile.phone.trim().replace(/\D/g, '');
  const users = getAllUsers();
  
  const updatedProfile: UserProfile = {
    ...profile,
    phone: cleanPhone,
    verifiedAt: profile.verifiedAt || new Date().toISOString(),
    wishlistProductIds: profile.wishlistProductIds || [],
    recentlyViewedProductIds: profile.recentlyViewedProductIds || [],
  };

  users[cleanPhone] = updatedProfile;
  saveAllUsers(users);
  return updatedProfile;
}

/**
 * Request OTP for phone number
 * Generates a 6-digit verification code and stores temporary OTP request
 */
export function sendOTP(phone: string, userName?: string): { otpCode: string; expiresAt: number } {
  const cleanPhone = phone.trim().replace(/\D/g, '');
  if (cleanPhone.length < 10) {
    throw new Error('Please enter a valid 10-digit phone number');
  }

  // Generate a realistic 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  const otpRequestState: OTPRequestState = {
    phone: cleanPhone,
    otpCode,
    expiresAt,
  };

  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_OTP, JSON.stringify(otpRequestState));
  } catch (err) {
    console.error('Error storing OTP state:', err);
  }

  return { otpCode, expiresAt };
}

/**
 * Verify OTP entered by the user
 */
export function verifyOTP(phone: string, otpInput: string, userName?: string): UserProfile {
  const cleanPhone = phone.trim().replace(/\D/g, '');
  const cleanOTP = otpInput.trim();

  // Retrieve stored OTP
  let activeOTP: OTPRequestState | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_OTP);
    if (raw) activeOTP = JSON.parse(raw);
  } catch (e) {
    // fallback
  }

  // Allow 123456 as a universal demo fallback code if generated OTP expires or fails
  const isValidCode = (activeOTP && activeOTP.phone === cleanPhone && activeOTP.otpCode === cleanOTP) || cleanOTP === '123456';

  if (!isValidCode) {
    throw new Error('Invalid OTP code. Please check the code or enter 123456 for instant demo verification.');
  }

  // Get or create user profile
  let existingUser = getUserProfile(cleanPhone);
  if (!existingUser) {
    existingUser = {
      phone: cleanPhone,
      name: userName || `User ${cleanPhone.slice(-4)}`,
      verifiedAt: new Date().toISOString(),
      wishlistProductIds: [],
      recentlyViewedProductIds: [],
    };
  } else if (userName && userName.trim()) {
    existingUser.name = userName.trim();
  }

  const saved = saveUserProfile(existingUser);
  setCurrentUserPhone(cleanPhone);

  // Clear active OTP request
  localStorage.removeItem(STORAGE_KEY_ACTIVE_OTP);

  return saved;
}

/**
 * Get the current logged-in user profile
 */
export function getCurrentUser(): UserProfile | null {
  try {
    const activePhone = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!activePhone) return null;
    return getUserProfile(activePhone);
  } catch (err) {
    return null;
  }
}

/**
 * Set active logged-in user phone number
 */
export function setCurrentUserPhone(phone: string | null): void {
  if (phone) {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, cleanPhone);
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  }
}

/**
 * Log out current user
 */
export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
}

/**
 * Sync dedicated per-user Wishlist to persistent file storage
 */
export function updateUserWishlist(phone: string, wishlistProductIds: string[]): void {
  const profile = getUserProfile(phone);
  if (profile) {
    profile.wishlistProductIds = wishlistProductIds;
    saveUserProfile(profile);
  }
}

/**
 * Sync dedicated per-user Recently Viewed history to persistent file storage
 */
export function updateUserHistory(phone: string, recentlyViewedProductIds: string[]): void {
  const profile = getUserProfile(phone);
  if (profile) {
    profile.recentlyViewedProductIds = recentlyViewedProductIds;
    saveUserProfile(profile);
  }
}
