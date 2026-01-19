/**
 * Safe localStorage utility with SSR compatibility and error handling
 * 
 * This utility provides a type-safe way to interact with localStorage
 * while handling edge cases like:
 * - SSR environments where window is undefined
 * - Storage quota exceeded errors
 * - Invalid JSON parsing
 * - Private browsing mode restrictions
 */

const isBrowser = typeof window !== 'undefined';

/**
 * Get an item from localStorage with type safety
 * @param key - The storage key
 * @param defaultValue - Default value if key doesn't exist or parsing fails
 * @returns The parsed value or default value
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
    if (!isBrowser) {
        return defaultValue;
    }

    try {
        const item = localStorage.getItem(key);
        if (item === null) {
            return defaultValue;
        }
        return JSON.parse(item) as T;
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
}

/**
 * Set an item in localStorage with error handling
 * @param key - The storage key
 * @param value - The value to store (will be JSON stringified)
 * @returns true if successful, false otherwise
 */
export function setStorageItem<T>(key: string, value: T): boolean {
    if (!isBrowser) {
        return false;
    }

    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
        // Handle quota exceeded
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.warn('localStorage quota exceeded, consider clearing old data');
        }
        return false;
    }
}

/**
 * Remove an item from localStorage
 * @param key - The storage key to remove
 */
export function removeStorageItem(key: string): void {
    if (!isBrowser) {
        return;
    }

    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn(`Error removing localStorage key "${key}":`, error);
    }
}

/**
 * Get a simple string value from localStorage (no JSON parsing)
 * @param key - The storage key
 * @returns The string value or null
 */
export function getStorageString(key: string): string | null {
    if (!isBrowser) {
        return null;
    }

    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
        return null;
    }
}

/**
 * Set a simple string value in localStorage (no JSON stringification)
 * @param key - The storage key
 * @param value - The string value to store
 * @returns true if successful, false otherwise
 */
export function setStorageString(key: string, value: string): boolean {
    if (!isBrowser) {
        return false;
    }

    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
        return false;
    }
}

// Storage key constants for the app
export const STORAGE_KEYS = {
    ADMIN_AUTH: 'pfcu_admin_auth',
    ROLE_SELECTED: 'pfcu_role_selected',
    SERMONS_CACHE: 'pfcu_sermons',
    LEADERS_CACHE: 'pfcu_leaders',
    DONATIONS_CACHE: 'pfcu_donations',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
