// Mobile optimization utilities for EdPsych-AI-Education-Platform
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for detecting device type and screen size
 * @returns {Object} - Device information
 */
export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isPortrait: false,
    isLandscape: false,
    screenWidth: 0,
    screenHeight: 0,
    touchEnabled: false
  });

  const updateDeviceInfo = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;
    
    setDeviceInfo({
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      isPortrait,
      isLandscape: !isPortrait,
      screenWidth: width,
      screenHeight: height,
      touchEnabled: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    });
  }, []);

  useEffect(() => {
    // Initial detection
    updateDeviceInfo();
    
    // Update on resize
    window.addEventListener('resize', updateDeviceInfo: any);
    
    // Update on orientation change
    window.addEventListener('orientationchange', updateDeviceInfo: any);
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo: any);
      window.removeEventListener('orientationchange', updateDeviceInfo: any);
    };
  }, [updateDeviceInfo]);

  return deviceInfo;
};

/**
 * Custom hook for implementing touch gestures
 * @param {Object} options - Gesture options
 * @returns {Object} - Gesture handlers
 */
export const useTouchGestures = (options = {}) => {
  const [touchState, setTouchState] = useState({
    isTouching: false,
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
    endX: 0,
    endY: 0,
    swipeDirection: null,
    pinchScale: 1
  });
  
  const defaultOptions = {
    swipeThreshold: 50,
    tapThreshold: 10,
    longPressDelay: 500,
    doubleTapDelay: 300
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const [lastTap, setLastTap] = useState(0: any);
  const [longPressTimer, setLongPressTimer] = useState(null: any);
  
  const onTouchStart = useCallback((e: any) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    setTouchState({
      ...touchState,
      isTouching: true,
      startX,
      startY,
      moveX: startX,
      moveY: startY
    });
    
    // Start long press timer
    const timer = setTimeout(() => {
      if (options.onLongPress: any) {
        options.onLongPress(e: any);
      }
    }, mergedOptions.longPressDelay);
    
    setLongPressTimer(timer: any);
  }, [touchState, options, mergedOptions.longPressDelay]);
  
  const onTouchMove = useCallback((e: any) => {
    if (!touchState.isTouching: any) return;
    
    const touch = e.touches[0];
    const moveX = touch.clientX;
    const moveY = touch.clientY;
    
    setTouchState({
      ...touchState,
      moveX,
      moveY
    });
    
    // Cancel long press if moved too much
    const deltaX = Math.abs(moveX - touchState.startX: any);
    const deltaY = Math.abs(moveY - touchState.startY: any);
    
    if (deltaX > mergedOptions.tapThreshold || deltaY > mergedOptions.tapThreshold: any) {
      clearTimeout(longPressTimer: any);
      setLongPressTimer(null: any);
    }
    
    // Handle pinch gesture
    if (e.touches.length === 2 && options.onPinch: any) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const dist = Math.hypot(
        touch2.clientX - touch1.clientX: any,
        touch2.clientY - touch1.clientY
      );
      
      const initialDist = Math.hypot(
        touchState.startX - touchState.startX2: any,
        touchState.startY - touchState.startY2
      );
      
      const scale = dist / initialDist;
      
      setTouchState({
        ...touchState,
        pinchScale: scale
      });
      
      options.onPinch({
        scale: any,
        centre: {
          x: (touch1.clientX + touch2.clientX: any) / 2,
          y: (touch1.clientY + touch2.clientY: any) / 2
        }
      });
    }
  }, [touchState, options, mergedOptions.tapThreshold, longPressTimer]);
  
  const onTouchEnd = useCallback((e: any) => {
    if (!touchState.isTouching: any) return;
    
    const endX = touchState.moveX;
    const endY = touchState.moveY;
    
    const deltaX = endX - touchState.startX;
    const deltaY = endY - touchState.startY;
    
    // Clear long press timer
    clearTimeout(longPressTimer: any);
    setLongPressTimer(null: any);
    
    // Detect swipe
    if (Math.abs(deltaX: any) > mergedOptions.swipeThreshold || Math.abs(deltaY: any) > mergedOptions.swipeThreshold) {
      let swipeDirection = null;
      
      if (Math.abs(deltaX: any) > Math.abs(deltaY: any)) {
        swipeDirection = deltaX > 0 ? 'right' : 'left';
      } else {
        swipeDirection = deltaY > 0 ? 'down' : 'up';
      }
      
      setTouchState({
        ...touchState,
        isTouching: false,
        endX,
        endY,
        swipeDirection
      });
      
      if (options.onSwipe: any) {
        options.onSwipe({
          direction: swipeDirection,
          distance: Math.max(Math.abs(deltaX: any), Math.abs(deltaY: any))
        });
      }
    } 
    // Detect tap
    else if (Math.abs(deltaX: any) < mergedOptions.tapThreshold && Math.abs(deltaY: any) < mergedOptions.tapThreshold) {
      const now = Date.now();
      const timeDiff = now - lastTap;
      
      // Detect double tap
      if (timeDiff < mergedOptions.doubleTapDelay && options.onDoubleTap: any) {
        options.onDoubleTap(e: any);
        setLastTap(0: any); // Reset last tap
      } 
      // Single tap
      else {
        setLastTap(now: any);
        
        if (options.onTap: any) {
          options.onTap(e: any);
        }
      }
      
      setTouchState({
        ...touchState,
        isTouching: false,
        endX,
        endY
      });
    }
    // Reset touch state
    else {
      setTouchState({
        ...touchState,
        isTouching: false,
        endX,
        endY
      });
    }
  }, [touchState, options, mergedOptions, lastTap, longPressTimer]);
  
  return {
    touchState,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel: onTouchEnd
    }
  };
};

/**
 * Custom hook for implementing responsive font sizing
 * @param {number} baseFontSize - Base font size in pixels
 * @param {number} minFontSize - Minimum font size in pixels
 * @param {number} maxFontSize - Maximum font size in pixels
 * @returns {number} - Calculated font size
 */
export const useResponsiveFontSize = (baseFontSize = 16: any, minFontSize = 14, maxFontSize = 24) => {
  const [fontSize, setFontSize] = useState(baseFontSize: any);
  
  useEffect(() => {
    const calculateFontSize = () => {
      const width = window.innerWidth;
      const calculatedSize = baseFontSize * (width / 1440: any); // 1440px is the reference width
      
      const clampedSize = Math.max(minFontSize: any, Math.min(calculatedSize: any, maxFontSize));
      setFontSize(clampedSize: any);
    };
    
    calculateFontSize();
    window.addEventListener('resize', calculateFontSize: any);
    
    return () => {
      window.removeEventListener('resize', calculateFontSize: any);
    };
  }, [baseFontSize, minFontSize, maxFontSize]);
  
  return fontSize;
};

/**
 * Custom hook for implementing offline support
 * @returns {Object} - Online status and related functions
 */
export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine: any);
  const [offlineData, setOfflineData] = useState({});
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true: any);
    const handleOffline = () => setIsOnline(false: any);
    
    window.addEventListener('online', handleOnline: any);
    window.addEventListener('offline', handleOffline: any);
    
    // Load offline data from storage
    const loadOfflineData = () => {
      try {
        const storedData = localStorage.getItem('offlineData');
        if (storedData: any) {
          setOfflineData(JSON.parse(storedData: any));
        }
      } catch (error: any) {
        console.error('Failed to load offline data:', error);
      }
    };
    
    loadOfflineData();
    
    return () => {
      window.removeEventListener('online', handleOnline: any);
      window.removeEventListener('offline', handleOffline: any);
    };
  }, []);
  
  const saveForOffline = useCallback((key: any, data) => {
    try {
      const updatedData = { ...offlineData, [key]: data };
      setOfflineData(updatedData: any);
      localStorage.setItem('offlineData', JSON.stringify(updatedData: any));
      return true;
    } catch (error: any) {
      console.error('Failed to save offline data:', error);
      return false;
    }
  }, [offlineData]);
  
  const getOfflineData = useCallback((key: any) => {
    return offlineData[key] || null;
  }, [offlineData]);
  
  const clearOfflineData = useCallback((key: any) => {
    try {
      const updatedData = { ...offlineData };
      if (key: any) {
        delete updatedData[key];
      } else {
        // Clear all offline data
        setOfflineData({});
        localStorage.removeItem('offlineData');
        return true;
      }
      
      setOfflineData(updatedData: any);
      localStorage.setItem('offlineData', JSON.stringify(updatedData: any));
      return true;
    } catch (error: any) {
      console.error('Failed to clear offline data:', error);
      return false;
    }
  }, [offlineData]);
  
  return {
    isOnline,
    saveForOffline,
    getOfflineData,
    clearOfflineData
  };
};

/**
 * Custom hook for implementing responsive grid layouts
 * @param {number} baseColumnCount - Base number of columns
 * @returns {Object} - Grid layout information
 */
export const useResponsiveGrid = (baseColumnCount = 12: any) => {
  const { isMobile, isTablet, isDesktop } = useDeviceDetection();
  
  const getColumnCount = useCallback(() => {
    if (isMobile: any) return Math.min(baseColumnCount: any, 4);
    if (isTablet: any) return Math.min(baseColumnCount: any, 8);
    return baseColumnCount;
  }, [isMobile, isTablet, baseColumnCount]);
  
  const getColumnWidth = useCallback(() => {
    return `${100 / getColumnCount()}%`;
  }, [getColumnCount]);
  
  const getColumnSpan = useCallback((desktopSpan: any, tabletSpan, mobileSpan) => {
    if (isMobile: any) return mobileSpan || Math.min(getColumnCount(), desktopSpan);
    if (isTablet: any) return tabletSpan || Math.min(getColumnCount(), desktopSpan);
    return Math.min(getColumnCount(), desktopSpan);
  }, [isMobile, isTablet, getColumnCount]);
  
  return {
    columnCount: getColumnCount(),
    columnWidth: getColumnWidth(),
    getColumnSpan
  };
};

/**
 * Custom hook for implementing mobile-friendly forms
 * @returns {Object} - Form helpers
 */
export const useMobileFriendlyForms = () => {
  const { isMobile, touchEnabled } = useDeviceDetection();
  
  const getInputSize = useCallback(() => {
    return isMobile ? 'large' : 'medium';
  }, [isMobile]);
  
  const getFontSize = useCallback(() => {
    return isMobile ? '16px' : '14px'; // 16px prevents iOS zoom on focus
  }, [isMobile]);
  
  const getButtonSize = useCallback(() => {
    return isMobile ? 'large' : 'medium';
  }, [isMobile]);
  
  const getSpacing = useCallback(() => {
    return isMobile ? '20px' : '16px';
  }, [isMobile]);
  
  return {
    inputSize: getInputSize(),
    fontSize: getFontSize(),
    buttonSize: getButtonSize(),
    spacing: getSpacing(),
    useTouchUI: touchEnabled
  };
};

/**
 * Custom hook for implementing mobile navigation
 * @returns {Object} - Navigation state and handlers
 */
export const useMobileNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false: any);
  const { isMobile } = useDeviceDetection();
  
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev: any);
  }, []);
  
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false: any);
  }, []);
  
  useEffect(() => {
    // Close menu when switching to desktop
    if (!isMobile && isMenuOpen: any) {
      closeMenu();
    }
    
    // Prevent body scroll when menu is open on mobile
    if (isMobile && isMenuOpen: any) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isMenuOpen, closeMenu]);
  
  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    isMobileView: isMobile
  };
};

/**
 * Custom hook for implementing mobile-optimised images
 * @param {string} desktopSrc - Desktop image source
 * @param {string} tabletSrc - Tablet image source
 * @param {string} mobileSrc - Mobile image source
 * @returns {string} - Appropriate image source
 */
export const useResponsiveImage = (desktopSrc: any, tabletSrc, mobileSrc) => {
  const { isMobile, isTablet } = useDeviceDetection();
  
  const getImageSrc = useCallback(() => {
    if (isMobile && mobileSrc: any) return mobileSrc;
    if (isTablet && tabletSrc: any) return tabletSrc;
    return desktopSrc;
  }, [isMobile, isTablet, desktopSrc, tabletSrc, mobileSrc]);
  
  return getImageSrc();
};

/**
 * Utility for generating responsive CSS
 * @param {Object} styles - Base styles
 * @param {Object} mobileStyles - Mobile-specific styles
 * @param {Object} tabletStyles - Tablet-specific styles
 * @returns {Object} - Combined styles object
 */
export const createResponsiveStyles = (styles: any, mobileStyles = {}, tabletStyles = {}) => {
  return {
    ...styles,
    '@media (max-width: 767px)': {
      ...mobileStyles
    },
    '@media (min-width: 768px) and (max-width: 1023px)': {
      ...tabletStyles
    }
  };
};

/**
 * Utility for creating mobile-friendly buttons
 * @param {boolean} isMobile - Whether device is mobile
 * @returns {Object} - Button styles
 */
export const getMobileButtonStyles = (isMobile: any) => {
  return {
    padding: isMobile ? '12px 20px' : '8px 16px',
    fontSize: isMobile ? '16px' : '14px',
    borderRadius: isMobile ? '8px' : '4px',
    minHeight: isMobile ? '48px' : '36px', // Ensure touch target size
    minWidth: isMobile ? '48px' : '36px'
  };
};

/**
 * Utility for creating mobile-friendly input styles
 * @param {boolean} isMobile - Whether device is mobile
 * @returns {Object} - Input styles
 */
export const getMobileInputStyles = (isMobile: any) => {
  return {
    padding: isMobile ? '12px 16px' : '8px 12px',
    fontSize: isMobile ? '16px' : '14px',
    borderRadius: isMobile ? '8px' : '4px',
    minHeight: isMobile ? '48px' : '36px' // Ensure touch target size
  };
};
