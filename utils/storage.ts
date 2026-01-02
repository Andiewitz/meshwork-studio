/**
 * Safe Storage Utility
 * Prevents "SecurityError: The operation is insecure" when localStorage is blocked or unavailable.
 */

class SafeStorage {
  private memoryStorage: Record<string, string> = {};

  private get storage(): Storage | null {
    try {
      // Some environments throw even when just accessing the property
      return typeof window !== 'undefined' ? window.localStorage : null;
    } catch (e) {
      return null;
    }
  }

  getItem(key: string): string | null {
    try {
      const s = this.storage;
      if (!s) return this.memoryStorage[key] || null;
      return s.getItem(key);
    } catch (e) {
      console.warn(`SafeStorage: Falling back to memory for key "${key}" due to security error.`);
      return this.memoryStorage[key] || null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      const s = this.storage;
      if (!s) {
        this.memoryStorage[key] = value;
        return;
      }
      s.setItem(key, value);
    } catch (e) {
      console.warn(`SafeStorage: Falling back to memory for key "${key}" due to security error.`);
      this.memoryStorage[key] = value;
    }
  }

  removeItem(key: string): void {
    try {
      const s = this.storage;
      if (s) s.removeItem(key);
      delete this.memoryStorage[key];
    } catch (e) {
      delete this.memoryStorage[key];
    }
  }

  clear(): void {
    try {
      const s = this.storage;
      if (s) s.clear();
      this.memoryStorage = {};
    } catch (e) {
      this.memoryStorage = {};
    }
  }
}

export const safeStorage = new SafeStorage();