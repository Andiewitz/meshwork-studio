import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';

interface PageTransitionProps {
  children: React.ReactNode;
  isLoading?: boolean; // Allow external control (e.g. data fetching)
  loadingMessage?: string;
  minDuration?: number; // Minimum time to show loader in ms
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  isLoading: externalLoading, 
  loadingMessage,
  minDuration = 600 
}) => {
  const [minLoadFinished, setMinLoadFinished] = useState(false);

  useEffect(() => {
    // Reset state on mount
    setMinLoadFinished(false);
    
    // Start timer
    const timer = setTimeout(() => {
      setMinLoadFinished(true);
    }, minDuration);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs once per mount of the wrapper

  // Show loader if the minimum time hasn't passed OR if the parent component is still loading data
  const showLoader = !minLoadFinished || (externalLoading === true);

  if (showLoader) {
    return <LoadingScreen message={loadingMessage} fullScreen={false} />;
  }

  return (
    <div className="page-enter h-full w-full">
      {children}
    </div>
  );
};