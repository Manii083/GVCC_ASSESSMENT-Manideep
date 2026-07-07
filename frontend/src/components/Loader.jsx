import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#3b82f6"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );
};

export default Loader;