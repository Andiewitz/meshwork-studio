
/**
 * Safe Storage Utility
 * Prevents "SecurityError: The operation is insecure" by catching access denied errors
 * at the property access level and falling back to in-memory storage.
 */

class SafeStorage {
  private memoryStorage: Record<string, string> = {};
  private _availabilityChecked: boolean = false;
  private _isLocalStorageAvailable: boolean = false;

  private testLocalStorage(): boolean {
    if (this._availabilityChecked) return this._isLocalStorageAvailable;
    
    try {
      if (typeof window === 'undefined') return false;
      
      // Crucial: Just accessing window.localStorage can throw in some sandboxes
      const storage = window.localStorage;
      if (!storage) {
        this._isLocalStorageAvailable = false;
        this._availabilityChecked = true;
        return false;
      }

      const testKey = '__storage_test__';
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      
      this._isLocalStorageAvailable = true;
    } catch (e) {
      console.warn("Storage access restricted. Meshwork is running in memory-only mode.");
      this._isLocalStorageAvailable = false;
    } finally {
      this._availabilityChecked = true;
    }
    return this._isLocalStorageAvailable;
  }

  getItem(key: string): string | null {
    if (this.testLocalStorage()) {
      try {
        return window.localStorage.getItem(key);
      } catch (e) {
        return this.memoryStorage[key] || null;
      }
    }
    return this.memoryStorage[key] || null;
  }

  setItem(key: string, value: string): void {
    if (this.testLocalStorage()) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch (e) {
        // Log error and fall through
      }
    }
    this.memoryStorage[key] = value;
  }

  removeItem(key: string): void {
    if (this.testLocalStorage()) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {}
    }
    delete this.memoryStorage[key];
  }

  clear(): void {
    if (this.testLocalStorage()) {
      try {
        window.localStorage.clear();
      } catch (e) {}
    }
    this.memoryStorage = {};
  }
}

export const safeStorage = new SafeStorage();
