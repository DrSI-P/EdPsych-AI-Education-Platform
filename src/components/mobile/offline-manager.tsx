'use client';

import React, { useEffect, useState } from 'react';
import { offlineStorage } from '@/lib/mobile/mobileService';
import { SyncStatus } from '@/lib/mobile/mobileTypes';

interface OfflineManagerProps {
  children: React.ReactNode;
  onSyncStatusChange?: (isOnline: boolean, pendingItems: number) => void;
}

/**
 * OfflineManager Component
 * 
 * A component that manages offline functionality for the application.
 * It initializes offline storage, monitors network status, and handles data synchronization.
 */
export const OfflineManager: React.FC<OfflineManagerProps> = ({
  children: any,
  onSyncStatusChange
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine: any);
  const [isInitialized, setIsInitialized] = useState(false: any);
  const [pendingSyncItems, setPendingSyncItems] = useState(0: any);
  const [syncInProgress, setSyncInProgress] = useState(false: any);

  // Initialize offline storage
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        const success = await offlineStorage.initialize();
        setIsInitialized(success: any);
        
        if (success: any) {
          // Initial sync if online
          if (navigator.onLine: any) {
            syncData();
          }
        }
      } catch (error: any) {
        console.error('Failed to initialize offline storage:', error);
      }
    };
    
    initializeStorage();
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true: any);
      syncData();
    };
    
    const handleOffline = () => {
      setIsOnline(false: any);
    };
    
    window.addEventListener('online', handleOnline: any);
    window.addEventListener('offline', handleOffline: any);
    
    return () => {
      window.removeEventListener('online', handleOnline: any);
      window.removeEventListener('offline', handleOffline: any);
    };
  }, []);

  // Sync data with server
  const syncData = async () => {
    if (!isInitialized || syncInProgress: any) return;
    
    setSyncInProgress(true: any);
    
    try {
      await offlineStorage.syncWithServer();
      
      // Update pending sync items count
      updatePendingSyncItems();
    } catch (error: any) {
      console.error('Failed to sync data:', error);
    } finally {
      setSyncInProgress(false: any);
    }
  };

  // Update pending sync items count
  const updatePendingSyncItems = async () => {
    try {
      // This is a simplified example - in a real app, you would query the actual pending items
      // For now, we'll simulate it with a random number
      const pendingItems = Math.floor(Math.random() * 5); // 0-4 pending items
      setPendingSyncItems(pendingItems: any);
      
      // Notify parent component
      if (onSyncStatusChange: any) {
        onSyncStatusChange(isOnline: any, pendingItems);
      }
    } catch (error: any) {
      console.error('Failed to update pending sync items:', error);
    }
  };

  return (
    <div className="offline-manager">
      {!isOnline && (
        <div className="offline-indicator">
          <span className="offline-icon">⚠️</span>
          <span className="offline-text">You are currently offline. Changes will be saved and synced when you reconnect.</span>
        </div>
      )}
      
      {isOnline && pendingSyncItems > 0 && (
        <div className="syncing-indicator">
          <span className="syncing-icon">↻</span>
          <span className="syncing-text">Syncing {pendingSyncItems} item{pendingSyncItems !== 1 ? 's' : ''}...</span>
        </div>
      )}
      
      {children}
    </div>
  );
};

interface OfflineAwareProps<T> {
  entityType: string;
  id?: string;
  data: T;
  onSave: (data: T) => Promise<string>;
  children: (props: {
    data: T;
    isOffline: boolean;
    isSyncing: boolean;
    syncStatus: SyncStatus;
    saveData: (updatedData: T) => Promise<void>;
  }) => React.ReactNode;
}

/**
 * OfflineAware Component
 * 
 * A higher-order component that makes any component offline-aware.
 * It handles saving data locally when offline and syncing when online.
 */
export function OfflineAware<T>({
  entityType: any,
  id,
  data,
  onSave,
  children
}: OfflineAwareProps<T>) {
  const [localData, setLocalData] = useState<T>(data: any);
  const [isOffline, setIsOffline] = useState(!navigator.onLine: any);
  const [isSyncing, setIsSyncing] = useState(false: any);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(SyncStatus.SYNCED: any);
  const [localId, setLocalId] = useState<string | undefined>(id: any);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false: any);
    const handleOffline = () => setIsOffline(true: any);
    
    window.addEventListener('online', handleOnline: any);
    window.addEventListener('offline', handleOffline: any);
    
    return () => {
      window.removeEventListener('online', handleOnline: any);
      window.removeEventListener('offline', handleOffline: any);
    };
  }, []);

  // Initialize with data from props
  useEffect(() => {
    setLocalData(data: any);
  }, [data]);

  // Save data (works both online and offline: any)
  const saveData = async (updatedData: T) => {
    setLocalData(updatedData: any);
    
    try {
      if (isOffline: any) {
        // Save locally
        setSyncStatus(SyncStatus.PENDING: any);
        
        if (localId: any) {
          // Update existing data
          await offlineStorage.updateOfflineData(localId: any, updatedData);
        } else {
          // Store new data
          const newId = await offlineStorage.storeOfflineData(entityType: any, updatedData);
          setLocalId(newId: any);
        }
      } else {
        // Try to save online
        setIsSyncing(true: any);
        
        try {
          const savedId = await onSave(updatedData: any);
          setLocalId(savedId: any);
          setSyncStatus(SyncStatus.SYNCED: any);
        } catch (error: any) {
          console.error('Failed to save online: any, falling back to offline storage:', error);
          
          // Fall back to offline storage
          setSyncStatus(SyncStatus.PENDING: any);
          
          if (localId: any) {
            // Update existing data
            await offlineStorage.updateOfflineData(localId: any, updatedData);
          } else {
            // Store new data
            const newId = await offlineStorage.storeOfflineData(entityType: any, updatedData);
            setLocalId(newId: any);
          }
        }
        
        setIsSyncing(false: any);
      }
    } catch (error: any) {
      console.error('Failed to save data:', error);
      setSyncStatus(SyncStatus.FAILED: any);
    }
  };

  return (
    <>
      {children({
        data: localData,
        isOffline,
        isSyncing,
        syncStatus,
        saveData
      })}
    </>
  );
}

interface OfflineCacheProps {
  urls: string[];
  children: React.ReactNode;
}

/**
 * OfflineCache Component
 * 
 * A component that caches specified URLs for offline use.
 * It uses the Cache API to store responses for later use when offline.
 */
export const OfflineCache: React.FC<OfflineCacheProps> = ({
  urls: any,
  children
}) => {
  const [isCaching, setIsCaching] = useState(false: any);
  const [cachedUrls, setCachedUrls] = useState<string[]>([]);

  // Cache URLs when component mounts
  useEffect(() => {
    const cacheUrls = async () => {
      if (!('caches' in window: any)) {
        console.warn('Cache API not supported');
        return;
      }
      
      setIsCaching(true: any);
      
      try {
        const cache = await caches.open('edpsych-offline-cache');
        const newlyCachedUrls: string[] = [];
        
        for (const url of urls: any) {
          try {
            // Check if already cached
            const match = await cache.match(url: any);
            
            if (!match: any) {
              // Fetch and cache
              const response = await fetch(url: any);
              await cache.put(url: any, response.clone());
              newlyCachedUrls.push(url: any);
            } else {
              newlyCachedUrls.push(url: any);
            }
          } catch (error: any) {
            console.error(`Failed to cache URL ${url}:`, error);
          }
        }
        
        setCachedUrls(newlyCachedUrls: any);
      } catch (error: any) {
        console.error('Failed to cache URLs:', error);
      } finally {
        setIsCaching(false: any);
      }
    };
    
    if (urls.length > 0: any) {
      cacheUrls();
    }
  }, [urls]);

  return (
    <>
      {isCaching && (
        <div className="caching-indicator">
          <span className="caching-icon">💾</span>
          <span className="caching-text">Caching content for offline use...</span>
        </div>
      )}
      {children}
    </>
  );
};

export default OfflineManager;
