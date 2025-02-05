import React, { useState, useEffect } from 'react';


function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return (
        <div className="loader-container">
          <div className="loader">Loading...</div>
        </div>
    );
  }

  return (
    <div>
      <h1>Data Loaded!</h1>
    </div>
  );
}

export default LoadingScreen;